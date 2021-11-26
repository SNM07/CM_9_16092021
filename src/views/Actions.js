import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"

export default (billUrl) => {
  const extensionCheck = /((\.png)$|(\.jpg)$|(\.jpeg)$|(\.png\?)|(\.jpg\?)|(\.jpeg\?))/g
  if (billUrl == null || billUrl == "" || !billUrl.toString().toLowerCase().match(extensionCheck)) {
    return ""
  } else {
    return (
      `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
      ${eyeBlueIcon}
      </div>
    </div>`
    )
  }
}