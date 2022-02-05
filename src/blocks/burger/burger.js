const burger = document.querySelector(".burger")

burger.addEventListener("click", (event)=>{
    if(burger.classList.contains("change")){
        burger.classList.remove("change")
    }else{
        burger.classList.add("change")
    }
    // burger.classList.toggle("change")
})