const env = {
  apikey: "mdRUpiSAOfkwq6Yy5TZjbcjWS2hFtl6I",
  apiURL: "https://api.giphy.com/v1/stickers",
}

class List extends HTMLElement {
  constructor() {
    super()
    let shadow = this.attachShadow({ mode: "open" })
    this.divheader = document.createElement("div")
    this.divheader.innerHTML = "hola mundo"
    shadow.appendChild(this.divheader)
    this.state = undefined
    this.render()
  }

  getData = async (params) => {
    const trend = `${env.apiURL}/trending?api_key=${env.apikey}&limit=25&rating=g`
    const search = `${env.apiURL}/search?api_key=${env.apikey}&q=${params}&limit=25&offset=0&rating=g&lang=es?`
    fetch(params ? search : trend, {
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        return resp.data
      })
      .catch((err) => {
        console.log(err)
        return false
      })
  }

  connectedCallback() {
    const title = this.getAttribute("title")
    this.divheader.innerHTML = `hola ${title}`
    this.state = this.getData()
  }

  render() {
    if (this.state) {
      console.log(this.state)
      this.state.map((item) => {
        let listItem = document.createElement("li")
        listItem.innerHTML = `<img src="${item.images.original.url}" /></li>`
        this.shadow.appendChild(listItem)
      })
    } else {
      console.log(this.shadow)
      this.shadow.innerHTML = `<h1>nada que ver</h1>`
    }
  }
}

customElements.define("app-list", List)
