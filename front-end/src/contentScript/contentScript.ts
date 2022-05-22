import React, {useEffect} from 'react'
import {inference} from '../utils/api'
import ReactDOM from 'react-dom'

var div=document.createElement("h1");
div.innerText="마음에 들조의 추천"
var find = document.querySelector(".d-block.Link--secondary.no-underline.f6.mb-3")
find.insertAdjacentElement('afterend', div)