export const formatDate = (dateStr) => {
  /* const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if ((dateStr) === NaN || dateStr === "" ||     !dateStr.match(regEx)) return "Date non valide"  */
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}

export const formatAmount = (amount) => {
  if (amount == null || amount == "" || amount === NaN || amount === "NaN" || amount < 0) {
    return "-"
  } else {
    return amount
  }
}