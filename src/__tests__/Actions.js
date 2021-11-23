import { screen } from "@testing-library/dom"
import Actions from "../views/Actions.js"
import '@testing-library/jest-dom/extend-expect'


describe('Given I am connected as an Employee', () => {
  //Check for eye icon when extension is valid (jpeg/jpg/png)
  describe("When I am on Bills and the file is a jpeg/jpg/png", () => {
    test("Then the eye icon should display", () => {
      const billUrl = "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
      const html = Actions(billUrl)
      document.body.innerHTML = html
      const eye = screen.queryByTestId("icon-eye")
      const extensionCheck = /((\.png)$|(\.jpg)$|(\.jpeg)$|(\.png\?)|(\.jpg\?)|(\.jpeg\?))/g
      expect(html).toMatch(extensionCheck)
      expect(eye).not.toBeNull()
    })
  })
  
  //Check for eye icon when extension is not jpeg/jpg/png
  describe("When I am on Bills and the file is not a jpeg/jpg/png", () => {
    test("Then the eye icon should not display", () => {
      const billUrl = "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.pdf?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
      const html = Actions(billUrl)
      document.body.innerHTML = html
      const eye = screen.queryByTestId("icon-eye")
      expect(eye).toBeNull()
    })
  })
  
  //Check for eye icon when fileUrl is undefined
  describe("When I am on Bills and the file is undefined", () => {
    test("Then the eye icon should not display", () => {
      const billUrl = ""
      const html = Actions(billUrl)
      document.body.innerHTML = html
      const eye = screen.queryByTestId("icon-eye")
      expect(eye).toBeNull()
    })
  })
  
  //Check for eye icon when fileUrl is null
  describe("When I am on Bills and the file is null", () => {
    test("Then the eye icon should not display", () => {
      const billUrl = null
      const html = Actions(billUrl)
      document.body.innerHTML = html
      const eye = screen.queryByTestId("icon-eye")
      expect(eye).toBeNull()
    })
  })

  //Check for url
  describe('When I am on Bills page and there are bills with url for file', () => {
    test(('Then, it should save given url in data-bill-url custom attribute'), () => {
      const billUrl = "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
      const html = Actions(billUrl)
      document.body.innerHTML = html
      const eye = screen.queryByTestId("icon-eye")
      const extensionCheck = /((\.png)$|(\.jpg)$|(\.jpeg)$|(\.png\?)|(\.jpg\?)|(\.jpeg\?))/g
      expect(html).toMatch(extensionCheck)
      expect(screen.getByTestId('icon-eye')).toHaveAttribute('data-bill-url', billUrl)
    })
  })
})