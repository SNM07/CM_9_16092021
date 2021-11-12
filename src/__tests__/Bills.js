import { fireEvent, screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import {ROUTES} from "../constants/routes";
import Bills from "../containers/Bills";
import firebase from "../__mocks__/firebase";

// Define user - LocalStorage - Employee
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
window.localStorage.setItem(
  "user",
  JSON.stringify({
    type: "Employee",
  })
);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    //Check if bill icon is highlighted
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: [] })
      document.body.innerHTML = html

      const billIcon = screen.getByTestId("icon-window");
      expect(billIcon).toBeTruthy();
    })
    //Check if bills are ordered correctly
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
})

//Check loading page
describe('When I am on bills page but th page is loading', () => {
  test('Then the loading page should be rendered', () => {
    const html = BillsUI({ loading: true })
    document.body.innerHTML = html
    expect(screen.getAllByText('Loading...')).toBeTruthy()
  })
})

//Check error page
describe('When I am on bills page but an error is sent', () => {
  test('Then the error page should be rendered', () => {
    const html = BillsUI({ error: 'error message' })
    document.body.innerHTML = html
    expect(screen.getAllByText('Erreur')).toBeTruthy()
  })  
})

  //Check for eye icon when there is no bill
describe("When I am on Bills and there is no bill", () => {
  test("Then the container should be empty", () => {
    const html = BillsUI({ data: [] })
    document.body.innerHTML = html
    const eye = screen.queryByTestId("icon-eye")
    expect(eye).toBeNull()
  })
})

//Check the new bill modal
describe('When I click the new bill button', ()=> {
  test('Then new bill modal should open', ()=> {
    const html = BillsUI({data : []})
    document.body.innerHTML = html

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    
    const bills = new Bills({
      document,
      onNavigate,
      firestore: null,
      localStorage: window.localStorage
    })
    
    const button = screen.getByTestId('btn-new-bill')
    const handleClickNewBill = jest.fn((e)=> bills.handleClickNewBill(e))
    button.click('click', handleClickNewBill)
    fireEvent.click(button)
    expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
  })
})

//Check the eye icon modal
describe('When I click the eye icon button', ()=> {
  test('Then a modal should open', async () => {
    const html = BillsUI({data: bills})
    document.body.innerHTML = html

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({pathname})
    }
    const bill = new Bills({
      document,
      onNavigate,
      firestore: null,
      localStorage: window.localStorage,
    })

    $.fn.modal = jest.fn()

    const button = screen.getAllByTestId('icon-eye')[0]
    
    const handleClickIconEye = jest.fn((e) => {
      e.preventDefault()
      bill.handleClickIconEye(button)
    })
    button.addEventListener('click', handleClickIconEye)
    fireEvent.click(button)
    expect(handleClickIconEye).toHaveBeenCalled()

  })
})

// test d'intégration GET
describe("When I navigate to Bills Page", () => {
  test("fetches bills from mock API GET", async () => {
    const getSpy = jest.spyOn(firebase, "get")
    //Get bills and new bill
    const userBills = await firebase.get()
    //getSpy has to be called once
    expect(getSpy).toHaveBeenCalledTimes(1)
    //number of bills has to be 4
    expect(userBills.data.length).toBe(4)
  })
  //UI with error 404
  test("fetches bills from an API and fails with 404 message error", async () => {
    firebase.get.mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur 404"))
    )
    const html = BillsUI({ error: "Erreur 404" })
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 404/)
    expect(message).toBeTruthy()
  })
  //UI with error 500
  test("fetches messages from an API and fails with 500 message error", async () => {
    firebase.get.mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur 500"))
    )
    const html = BillsUI({ error: "Erreur 500" })
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 500/)
    expect(message).toBeTruthy()
  })
})

})