import { fireEvent, screen} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import firestore from "../app/Firestore.js"
import firebase from "../__mocks__/firebase.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import BillsUI from "../views/BillsUI.js";
import { ROUTES } from "../constants/routes"


// Setup
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
}

window.alert = jest.fn();
// Define user - LocalStorage - Employee
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
    }))
})

describe("Given I am connected as an employee", () => {
  describe("When I access NewBill Page", () => {
    //Display NewBill page
    test("Then the NewBill page should be rendered", () => {
      document.body.innerHTML = NewBillUI()
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })
    //Display form
    test("Then a form with nine fields should be rendered", () => {
      document.body.innerHTML = NewBillUI()
      const form = document.querySelector("form")
      expect(form.length).toEqual(9)
    })
  })
  describe("When I am on NewBill page", () => {
    describe("And I upload an image file with the correct extension", () => {
      //Show selected image file
      test("Then the file handler should show a file", () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["sample.txt"], "sample.txt", { type: "text/txt" })],
          }
        })
        const numberOfFile = screen.getByTestId("file").files.length
        expect(numberOfFile).toEqual(1)
      })
    })
    describe("And I upload a non-image file without correct extension", () => {
      //Display error alert window
      test("Then the error message should be display", async () => {
        //global.alert = jest.fn();
        window.alert.mockClear();
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["sample.txt"], "sample.txt", { type: "text/txt" })],
          }
        })
        expect(handleChangeFile).toBeCalled()
        expect(window.alert).toHaveBeenCalledTimes(1);
      })
    })
  })
})
    
    //test d'intégration POST
    describe("Given I am a user connected as an Employee", () => {
      describe("When I create a new bill", () => {
        test("it should add bill to mock API POST", async () => {
        const testBill = {
          type: "Restaurants et bars",
          name: "testBillResto",
          date: "2022-03-09",
          amount: 2,
          pct: 4,
          vat: "22",
          commentary: "bon resto",
          fileName: "test.png",
          fileUrl: "https://i.imgur.com/1wlZW6Q.png"
          }
          
          const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const submit = screen.getByTestId('form-new-bill')
          const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        newBill.createBill = (newBill) => newBill
        document.querySelector(`input[data-testid="expense-name"]`).value = testBill.name
        document.querySelector(`input[data-testid="datepicker"]`).value = testBill.date
        document.querySelector(`select[data-testid="expense-type"]`).value = testBill.type
        document.querySelector(`input[data-testid="amount"]`).value = testBill.amount
        document.querySelector(`input[data-testid="vat"]`).value = testBill.vat
        document.querySelector(`input[data-testid="pct"]`).value = testBill.pct
        document.querySelector(`textarea[data-testid="commentary"]`).value = testBill.commentary
        newBill.fileUrl = testBill.fileUrl
        newBill.fileName = testBill.fileName 
        submit.addEventListener('click', handleSubmit)
        fireEvent.click(submit)
        expect(handleSubmit).toHaveBeenCalled()
        
        const postSpy = jest.spyOn(firebase, "post")
				const postBill = await firebase.post(testBill)
        expect(postSpy).toHaveBeenCalledTimes(1)
        expect(postBill.data.length).toBe(5)
      })
      //test erreur 404
      test("Add bill to API and fails with 404 message error", async () => {
        firebase.post.mockImplementationOnce(() => Promise.reject(new Error("Erreur 404")))
        const html = BillsUI({ error: "Erreur 404" })
        document.body.innerHTML = html
  
        const message = await screen.getByText(/Erreur 404/)
  
        expect(message).toBeTruthy()
      })
      // test erreur 500
      test("Add bill to API and fails with 500 messager error", async () => {
        firebase.post.mockImplementationOnce(() => Promise.reject(new Error("Erreur 500")))
  
        const html = BillsUI({ error: "Erreur 500" })
        document.body.innerHTML = html
  
        const message = await screen.getByText(/Erreur 500/)
  
        expect(message).toBeTruthy()
      })
    })
  })
 