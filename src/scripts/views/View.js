export default class View {
  render() {
    this.parentElement.classList.remove("is-hidden");
  }
  hide() {
    this.parentElement.classList.add("is-hidden");
  }

  updateHtml(container, htmlStr) {
    container.innerHTML = htmlStr;
  }
}
