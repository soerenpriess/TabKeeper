import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMusic, faCartShopping, faCode, faBriefcase, faRocket, faHouse, faFireFlameCurved, faGamepad, faHeart, faStar, faFolder, faCube, faOtter, faCubes, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faMusic, faCartShopping, faCode, faBriefcase, faRocket, faHouse, faFireFlameCurved, faGamepad, faHeart, faStar, faFolder, faCube, faOtter, faCubes, faChevronDown)

const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')
