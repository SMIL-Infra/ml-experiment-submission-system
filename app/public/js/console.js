Function.prototype.getMultiLine = function () { var lines = new String(this); lines = lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/")); return lines; }

var string = function () {
  /*


   _____         _____ _      
  / ____|  /\   |_   _| |     
 | (___   /  \    | | | |     
  \___ \ / /\ \   | | | |     
  ____) / ____ \ _| |_| |____ 
 |_____/_/    \_|_____|______|
                              
                              


  */
}

window.console.log(string.getMultiLine());
window.console.log('⚽️🏀你们学学Git🎱🙏');

