import { writable } from "svelte/store";
import { browser } from '$app/environment';

var storedST = {};
if (browser) {
   if(localStorage.st)
   {
      storedST = JSON.parse(localStorage.st);
   }
   else{
      storedST = "na";
   }
}
export const stLS = writable(storedST);
stLS.subscribe((value) => {
    if (browser) {
        localStorage.st = JSON.stringify(value);
    }
});