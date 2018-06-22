var multiList = 'General';
var removeSVG = '<svg id="removetodo" fill="#c0cecb" x="0px" y="0px" viewBox="0 0 22 22"><g><g><path class="st0" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="st0" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="st0" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="st0" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg fill="#2ecc71" id="addtodo" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
var closeSVG = '<svg fill="#FFF" id="closebuttonagain" height="30" viewBox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg"> <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/> <path d="M0 0h24v24H0z" fill="none"/></svg>'
var completeList = document.getElementById('complete');
var todo = document.getElementById('todo');
var file = document.getElementById('preview');
var blob = null;
var addedBlob = null;
var swipe = true;
var wasFetched = false;
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;



navListener();

if (localStorage.getItem('checkFetch')) {
  console.log('fetch was true!');
  window.wasFetched = true;
} else {
  document.getElementById('loadingLine').innerText = "Welcome to Pocket List!";
}

fetch();

function isIE() {
  ua = navigator.userAgent;
  // MSIE used to detect old browsers and Trident used to newer ones
  var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
  return is_ie;
}
if (isIE()){
    alert('Your browser is not supported, please use Google Chrome, Mozilla Firefox, Opera, or Safari.');
}

 var data = {
   todo: [],
   list: ["General"]
};

var fetchDeclarer = {
  fetch: true,
}

function fetch() {
  if (wasFetched) {
    var t0 = performance.now();
      let request = window.indexedDB.open("todo", 1);

      request.onsuccess = function(e) {
        db = request.result;
        tx = db.transaction("todoStore", "readwrite");
        store = tx.objectStore("todoStore", "todo");
        var thing = store.getAll();
        thing.onsuccess = function(evt) {
          var x = thing.result[0];
          data = x;
          renderTodoList();
          console.log('Got data...');

          var t1 = performance.now();
          var perform = (t1 - t0);
          console.log("Call to fetch took " + (t1 - t0) + " milliseconds.");

          if (perform < 2000) {
            setTimeout(loadIn, 2000);
          } else {
            loadIn();
          }
      }
    }
  } else {
    setTimeout(loadIn, 2000);
  }
}



var liData = {
  "text": null,
  "img": null,
  "imgName": null,
  "todo": true,
  "label": null,
  "paragraph": null,
  "timeValue": null,
  "timeCompleted": null,
  "list": multiList,
}

function push() {
  if (liData.todo) {
    var obj = JSON.stringify(liData);
    data.todo.unshift(obj);
  }
    dataObject();
}

// Generates Todo List on Startup
 function renderTodoList() {
  if (!data.todo.length) return;
  for (var i = 0; i < data.todo.length; i++) {
    var dataLi = JSON.parse(data.todo[i]);
    var text = dataLi.text;

    if (dataLi.todo) {
      var completeData = false;
      ironman();
    } else {
      var completeData = true;
      checkFinishTime();

        function checkFinishTime() {
          // Check if the time of the current item was 24 hours ago..
          var time = dataLi.timeCompleted;
          var timeExpired = (time + 86400000);
          var now = new Date().getTime();
          var timeDifference = (timeExpired - now);

          if (timeDifference < 0) {
            data.todo.splice(i, 1);
            dataObject();
          } else {
            ironman();
          }
        }
    }

    function ironman() {
      var fetched = true;
      var imgData = dataLi.img;
      var imgNameData = dataLi.imgName;
      var labelData = dataLi.label;
      var paragraphData = dataLi.paragraph;
      var timeValueData = dataLi.timeValue;
      addItem(text, completeData, fetched, imgData, imgNameData, labelData, paragraphData, timeValueData);
    }
  }

  for (var j = 1; j < data.list.length; j++) {
    var multiList = data.list[j];
    addList(multiList);
  }
}

// Gets the Local Storage Array and Generates the todo and complete list
progress();
startUp();

function dataObject() {
  if (indexedDB) {
    let request = window.indexedDB.open("todo", 1);

    request.onupgradeneeded = function(e) {
      let db = request.result,
        store = db.createObjectStore("todoStore", {
          keyPath: "todo"});
    }

    request.onsuccess = function(e) {
      db = request.result;
      tx = db.transaction("todoStore", "readwrite");
      store = tx.objectStore("todoStore", "todo");
      store.clear()
      obj = JSON.stringify(data);
      store.add(data);
      db.close();
      localStorage.setItem('checkFetch', JSON.stringify(fetchDeclarer));
      }
    } else {
      alert("Your browser does not support IndexedDB, storing items will not be avaliable...")
  }

}

function loadIn() {
  document.getElementById('loadingScreen').style = "opacity: 0.0; webkit-opacity: 0.0; -o-opacity: 0.0; -moz-opacity: 0.0; visibility: hidden;";
}

// Focuses on the text box when starting up the app, this removes a click the user would have to make to add a new item
function startUp() {
  document.getElementById('item').focus();
}

// Grabs the value and then pushes it to dom and local storage
// Checks if there is a value and if the value is not a space, if there is a space it alerts the user that that's invalid.
function createItem() {
  var value = document.getElementById('item').value;
    if (value) {
      addItem(value.replace(/\s+/g,' ').trim());
      document.getElementById('item').value = "";
    } else {
      document.getElementById('item').value = "";
      alert('Error: Invalid entry, please add text to your entry!');
  }
}

// Event Listner For The Button Click
  document.getElementById('add').addEventListener('click', function () {
    createItem();
    previewFileOff();
  })

  // Event Listner For Enter and checks for active element
  document.addEventListener('keypress', function(event)  {
    var item = document.getElementById('item');
    if (document.activeElement === item) {
      if (event.keyCode == '13') {
        createItem();
        previewFileOff();
      }
    }
  });


// Upload file system
document.getElementById('upload').onchange = function uploadFile() {
  var upload = document.getElementById('upload');
  var fileType = this.files[0]['type'];
  var fileValue = fileType.split('/')[0];

  blob = URL.createObjectURL(this.files[0]);

// Changes the file to base64 information
  var fileReader = new FileReader();
  fileReader.readAsDataURL(this.files[0]);
  fileReader.onload = function() {
    base64 = fileReader.result;
    file.setAttribute('src', base64);
  }

// If the file is an image is previews the image like how the image should be previewed
  if (fileValue == 'image') {
      previewFileOff();
      previewImage();
    } else {
      alert('This file type is not yet supported, please choose an image.');
  }

  // Remove the previewed file
  file.addEventListener('click', function () {
    file.src = null;
    upload.value = null;
      previewFileOff();
  })
}

// Add List Object To the DOM
function addItem(text, completeData, fetched, imgData, imgNameData, labelData, paragraphData, timeValueData) {
  var todo = (completeData) ? document.getElementById('complete'):document.getElementById('todo');

  var newItem = document.createElement('li');
  newItem.innerHTML = text;

  var buttons = document.createElement('div');
  buttons.classList.add('buttons');

  var complete = document.createElement('svg');
  complete.innerHTML = completeSVG;

  var remove = document.createElement('svg');
  remove.innerHTML = removeSVG;

  var label = document.createElement('div');
  label.setAttribute('id', 'label');

  var paragraph = document.createElement('p');
  paragraph.setAttribute('id', 'paragraph');

  var clickBox = document.createElement('div');
  clickBox.setAttribute('id', 'click-box');

  var newImage = new Image();
  newImage.setAttribute('id', 'img-file');

  var container = document.createElement('div');
  container.setAttribute('id', 'img-container');

  var link = document.createElement('a');
  link.setAttribute('id', 'link');

  var timeValue = document.createElement('p');
  timeValue.setAttribute('id', 'timeValue');

  var countDown = document.createElement('p');
  countDown.setAttribute('id', 'countDown');

  function append() {
    buttons.appendChild(complete);
    buttons.appendChild(remove);
    newItem.appendChild(label);
    newItem.appendChild(buttons);
    newItem.appendChild(clickBox);
    newItem.appendChild(paragraph);

    if (fetched) {
      todo.appendChild(newItem);
      if (completeData) {
        todo.prepend(newItem);
      }
    } else {
      todo.prepend(newItem);
    }

    link.appendChild(newImage);
    container.appendChild(link);
    newItem.appendChild(container);
    newItem.appendChild(timeValue);
    newItem.appendChild(countDown);
  }

// Checks if preview has an image attached, if yes then it creates an image, div and link to download said image
  if (document.getElementById('preview').src) {
    var fileName = document.getElementById('upload').value.split('\\')[2];
    newImage.src = file.src;
    container.style = "display: block;";
    link.href = blob;
    link.setAttribute('download', fileName);
    upload.value = null;
  }

// Append Child of parent nodes
  append();
// Event Listeners
  remove.addEventListener('click', removeItem);

  complete.addEventListener('click', completeItem);

  label.addEventListener('click', colourPicker);

  clickBox.addEventListener('click', expandList);
  progress();

  liData.text = text;
  liData.img = file.src;
  liData.imgName = fileName;

  if (fetched) {
    if (imgData) {
      newImage.src = imgData;
      container.style = "display: block;";
      fileName = imgNameData;
      link.setAttribute('download', fileName);
      link.href = imgData;
    }
      label.style.backgroundColor = labelData;
      paragraph.innerText = paragraphData;

      if (timeValueData) {
        timeValue.innerText = timeValueData;
        countDown.style = "display: block;";
        countDownFunction(timeValueData, countDown);
      }

  } else {
    push();
  }
}

// Remove Item
function removeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;
  var length = parent.children.length;
  var complete = document.getElementById('complete');


// Remove item from local storage
  if (id === 'todo') {
    // Find the position of the li that was removed
    var position = 0;
    var currentNode = this.parentNode.parentNode;
    var firstNode = parent.firstChild;
    while(firstNode != currentNode) {
        currentNode = currentNode.previousSibling;
        position++;
    }

    data.todo.splice(position, 1);
  } else {
    var position = complete.childElementCount -1;
    var currentNode = this.parentNode.parentNode;
    var firstNode = parent.firstChild;
     while(firstNode != currentNode) {
         position--;
         currentNode = currentNode.previousSibling;
     }
     position = position + todo.childElementCount;

    data.todo.splice(position, 1);
  }
  dataObject();
// Remove Item From DOM
  item.remove();
  progress();
}

function completeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;
  var label = this.parentNode.previousSibling;

// Remove from current array / list and move to the other array / list
if (id === 'todo') {
  label.style = "background-color: #2ecc71;";

  var position = 0;
  var currentNode = this.parentNode.parentNode;
  var firstNode = parent.firstChild;
  while(firstNode != currentNode) {
      currentNode = currentNode.previousSibling;
      position++;
  }

  // Data stuff
  var now = new Date().getTime();
  var obj = JSON.parse(data.todo[position]);
  obj.timeCompleted = now;
  obj.todo = false;
  obj.label = "#2ecc71";
  obj.timeValue = null;
  var stringObj = JSON.stringify(obj);
  data.todo.splice(position, 1);
  data.todo.push(stringObj);
  item.childNodes[6].removeAttribute('style');
} else {
  var complete = document.getElementById('complete');
  var todo = document.getElementById('todo');
  var position = complete.childElementCount -1;
  var currentNode = this.parentNode.parentNode;
  var firstNode = parent.firstChild;
   while(firstNode != currentNode) {
       position--;
       currentNode = currentNode.previousSibling;
   }

  position = position + todo.childElementCount;

  label.removeAttribute('style');

  // Data Stuff
  var obj = JSON.parse(data.todo[position]);
  obj.timeCompleted = null;
  obj.todo = true;
  obj.label = null;
  var stringObj = JSON.stringify(obj);
  data.todo.splice(position, 1);
  data.todo.unshift(stringObj);
}

  dataObject();

  // Complete Toggle
  var target = (id === 'todo') ? completeList:todo;
  item.remove();
  target.insertBefore(item, target.childNodes[0]);
  progress();
}

// Gets progress of your todo list with some math
function progress() {
  var todoItems = todo.children.length;
  var completedItems = completeList.children.length;
  var progress = Math.round((completedItems/(completedItems + todoItems)*100))

  function mathStuff() {
    var r = 146.5;
    var circumference = r * 2 * Math.PI;
    var percentage = (progress / 100);
    var bar = document.getElementById('progress-bar');
    var barPercentage = Math.round(circumference * (1 - percentage));
    bar.setAttribute("stroke-dashoffset", barPercentage);
    document.getElementById('progress-percentage').innerHTML = progress + "%";
  }
// 0 / 0 is not a number, this fixes that.
  if (todoItems === 0 & completedItems === 0) {
    progress = 0;
    mathStuff();
  } else {
    mathStuff();
  }
}

function navListener() {
  // Navigation Button Event Listener
  document.getElementById('navButton').addEventListener('click', openNavigation);

    // Close navigation Button Event Listener
  document.getElementById('close').addEventListener('click', close);
    // If clicking anything but the navigation or the close button
  document.getElementById('overlay').addEventListener('click', close);
}

function openNavigation() {
  document.getElementById('navigation').style = "-webkit-transform: none; visibility: visible; transform: none;";
  document.getElementById('container').style = "filter:blur(5px);";
  document.getElementById('Gradient-Thing').style = "-webkit-transform: none; transform: none; visibility: visible;";
  document.getElementById('Basic-Footer').style = "-webkit-transform: none; transform: none; visibility: visible;";
  document.getElementById('overlay').style = "position: fixed; z-index: 80; width: 100%; height: 100%; background-color: #000; opacity: 0.2;";
}
  // Style Reset
function close() {
  document.getElementById('container').removeAttribute('style');
  document.getElementById('overlay').removeAttribute('style');
  document.getElementById('Basic-Footer').style = "visibility: visible;";
  document.getElementById('Gradient-Thing').style = "visibility: visible;";
  document.getElementById('navigation').style = "visibility: visible;";
}

// Event Listener For Clicking on the add button
document.getElementById('add-list').addEventListener('click', function () {
  createNewList();
})

// Event Listner for clicking enter
document.addEventListener('keypress', function(event)  {
  var input = document.getElementById('List-Input');
  if (document.activeElement === input) {
    if (event.keyCode == '13') {
      createNewList();
    }
  }
});

// Creates a new list in the navigation
function createNewList() {
  var value = document.getElementById('List-Input').value;
  if (value) {
    addList(value.replace(/\s+/g,' ').trim());
    document.getElementById('List-Input').value = "";
    data.list.push(value.replace(/\s+/g,' ').trim());
    dataObject();
  } else {
    document.getElementById('item').value = "";
    alert('Error: Invalid entry, please add text to your entry!');
  }
}

// Add Item For the Lists
function addList(text) {
  var listOfLists = document.getElementById('todo-lists');
  var newItem = document.createElement('li');
  newItem.innerHTML = text;
  listOfLists.append(newItem);
}

// Colour Picker Thing
function colourPicker() {
  // element is the label intially clicked on
    var element = this;
    var list = element.parentNode.parentNode;
    var todo = document.getElementById('todo');

    var position = -1;
    var currentNode = this.parentNode;
    var firstNode = parent.firstChild;
     while(firstNode != currentNode) {
        currentNode = currentNode.previousSibling;
        position++;
     }

    if (list === todo) {
      window.swipe = false;
      document.getElementById('colorPopUp').style = "visibility: visible; opacity: 1.0; webkit-opacity: 1.0; -o-opacity: 1.0; -moz-opacity: 1.0; opacity: 1.0;";
      document.getElementById('overlay').style = "position: fixed; z-index: 100; width: 100%; height: 100%; background-color: #000; opacity: 0.2;";
      document.getElementById('container').style = "filter:blur(5px);";

      var red = document.getElementById('red');
      var blue = document.getElementById('blue');
      var green = document.getElementById('green');
      var orange = document.getElementById('orange');
      var yellow = document.getElementById('yellow');
      var purple = document.getElementById('purple');
      var black = document.getElementById('black');
      var grey = document.getElementById('grey');
      var white = document.getElementById('white');

      red.addEventListener('click', function () {
        element.style = "background-color: #e74c3c;"
          repetition("#e74c3c");
      })

      blue.addEventListener('click', function () {
        element.style = "";
          repetition("");
      })

      green.addEventListener('click', function () {
        element.style = "background-color: #2ecc71;"
          repetition("#2ecc71");
      })

      orange.addEventListener('click', function () {
        element.style = "background-color: #e67e22;"
          repetition("#e67e22");
      })

      yellow.addEventListener('click', function () {
        element.style = "background-color: #f1c40f;"
          repetition("#f1c40f");
      })

      purple.addEventListener('click', function () {
        element.style = "background-color: #9b59b6;"
          repetition("#9b59b6");
      })

      black.addEventListener('click', function () {
        element.style = "background-color: #000;"
        repetition("#000");
      })

      grey.addEventListener('click', function () {
        element.style = "background-color: #95a5a6;"
        repetition("#95a5a6");
      })

      white.addEventListener('click', function () {
        element.style = "background-color: #ecf0f1;"
        repetition("#ecf0f1");
      })

      document.getElementById('overlay').addEventListener('click', function() {
        repetition();
      })

      document.getElementById('closeMenu').addEventListener('click', function() {
        repetition();
      })

      document.getElementById('color').onchange = function customColor() {
        var color = document.getElementById('color');
        var value = color.value;

        if (value) {
          element.style.backgroundColor = value;
          repetition(value);
          value = "";
        }
      }

      function repetition(color) {
        // Data stuff

        // This is causing an error on the second attempting running this but the error doesn't seem important
        // Because it's not actually causing any problems.
          var obj = JSON.parse(data.todo[position]);
          obj.label = color;
          var stringObj = JSON.stringify(obj);
          data.todo.splice(position, 1, stringObj);
          dataObject();

          document.getElementById('colorPopUp').removeAttribute('style');
          document.getElementById('overlay').removeAttribute('style');
          document.getElementById('container').removeAttribute('style');
          position = -1;
          element = "null";
          color = "null";
          obj.label = "null";
          obj = "null";
          stringObj = "null";
          window.swipe = true;
      }
    }
}

// Swipe Gesture
 window.onload = function swipe() {
    var touchstartX = 0;
    var touchendX = 0;
    var verticalDistance = false;
    var gestureZone = document.getElementById('container');

    gestureZone.addEventListener('touchstart', function(event) {
      touchstartX = event.changedTouches[0].screenX;
    }, false);

    gestureZone.addEventListener('touchend', function(event) {
      touchendX = event.changedTouches[0].screenX;

      handleGesture();
    }, false);

    gestureZone.addEventListener('touchstart', function(event) {
      touchstartY = event.changedTouches[0].screenY;
    }, false);

    gestureZone.addEventListener('touchend', function(event) {
      touchendY = event.changedTouches[0].screenY;
      checkDistance();
      handleGesture();
    }, false);

function checkDistance() {
  var distanceY = (touchendY - touchstartY);

  if (distanceY < 0) {
    distanceY = (distanceY * -1);
  }

  if (distanceY < 50) {
    verticalDistance = true;
  } else {
    verticalDistance = false;
  }
}

    function handleGesture() {
     if (window.swipe && verticalDistance) {
        if (touchendX >= (touchstartX + 65)) {
          openNavigation();
          window.swipe = false;
        }
        window.swipe = true;
        verticalDistance = null;
        distanceY = null;
      }
    }
  }

// Function that runs when a list is clicked on.
function expandList() {
  var element = this;
  var li = element.parentNode;
  var list = li.parentNode;
  var todo = document.getElementById('todo');

    // Expand it.
  if (list === todo) {
    // Variables and stuff
    window.swipe = false;
    var liText = li.childNodes[0];
    var clickBox = li.childNodes[3];
    var paragraph = li.childNodes[4];
    var img = li.childNodes[5].childNodes[0].childNodes[0];
    var overlay = document.getElementById('overlay');
    var expansionBox = document.getElementById('expansion');
    var dynamicLi = document.getElementById('dynamic-li');
    var notes = document.getElementById('notes');
    var uploadContainer = document.getElementById('upload-containAgain');
    var previewAgain = document.getElementById('previewAgain');
    var timeValue = li.childNodes[6];
    var countDownTimer = li.childNodes[7];

    // Data stuff
    var position = -1;
    var currentNode = this.parentNode;
    var firstNode = parent.firstChild;
     while(firstNode != currentNode) {
        currentNode = currentNode.previousSibling;
        position++;
     }

    if (img.src) {
      expansionBox.style = "height: 50%; top: 25%; visibility: visible; -webkit-opacity: 1.0; -o-opacity: 1.0; -moz-opacity: 1.0; opacity: 1.0;";
      uploadContainer.style = "display: block; width: 100%;";
      previewAgain.src = img.src;
      previewAgain.style = "visibility: visible; display: block;";
      spiderman();
    } else {
      expansionBox.style = "visibility: visible; opacity: 1.0; webkit-opacity: 1.0; -o-opacity: 1.0; -moz-opacity: 1.0; opacity: 1.0;";
      spiderman();
    }

    function spiderman() {
      document.getElementById('overlay').style = "position: fixed; z-index: 100; width: 100%; height: 100%; background-color: #000; opacity: 0.2;";
      document.getElementById('container').style = "filter:blur(5px);";
      dynamicLi.innerText = liText.textContent;
      notes.innerText = paragraph.innerText;
      document.getElementById('overlay').addEventListener('click', removeExpansion);
      uploadContainer.addEventListener('click', imageExpansion);
      document.getElementById('close-expansion').addEventListener('click', removeExpansion);
      document.getElementById('time').value = document.getElementById('timeValue').textContent;
    }

    function imageExpansion() {
      var img = new Image;
      img.setAttribute('id', 'expandedImage');
      img.setAttribute('src', previewAgain.src);

      var background = document.createElement('div');
      background.setAttribute('class', 'background');

      document.body.prepend(background);
      background.appendChild(img);

      var closeButton = document.createElement('svg');
      closeButton.innerHTML = closeSVG;
      background.appendChild(closeButton);

      var i = document.getElementsByClassName('background').length;
      if (i > 1) {
        for (var j = 1; j < i; j++) {
          img.remove();
          background.remove();
          closeButton.remove();
        }
      }

      closeButton.addEventListener('click', function() {
        img.remove();
        background.remove();
        closeButton.remove();
      })
    }

    function removeExpansion() {
        expansionBox.removeAttribute('style');
        liText.textContent = dynamicLi.innerText.replace(/\s+/g,' ').trim();
        paragraph.innerText = notes.innerText.replace(/\s+/g,' ').trim();
        expansionBox.removeAttribute('style');
        document.getElementById('overlay').removeAttribute('style');
        document.getElementById('container').removeAttribute('style');

        var obj = JSON.parse(data.todo[position]);
        obj.text = dynamicLi.innerText.replace(/\s+/g,' ').trim();
        obj.paragraph = notes.innerText.replace(/\s+/g,' ').trim();
        var stringObj = JSON.stringify(obj);
        data.todo.splice(position, 1, stringObj);
        dataObject();
        clear();
    }

    function clear() {
      element = "null";
      li = "null";
      list = "null";
      liText = "null";
      clickBox = "null";
      paragraph = "null";
      img = "null";
      previewSrc = "null";
      img = "null";
      obj = "null";
      position = -1;
      stringObj = "null";
      timeValue = "null";
      window.swipe = true;
      document.getElementById('time').value = null;
    }

    document.getElementById('uploadAgain').onchange = function uploadImage() {
      var upload = document.getElementById('uploadAgain');
      var fileType = this.files[0]['type'];
      var fileValue = fileType.split('/')[0];
      var previewAgain = document.getElementById('previewAgain');
      var fileName = document.getElementById('uploadAgain').value.split('\\')[2];

    // Changes the file to base64 information
      addedBlob = URL.createObjectURL(this.files[0]);

      var fileReader = new FileReader();
      fileReader.readAsDataURL(this.files[0]);
      fileReader.onload = function() {
        base64 = fileReader.result;
        previewAgain.setAttribute('src', base64);

        var previewSrc = previewAgain.src;
        var img = li.childNodes[5].childNodes[0].childNodes[0];
        expansionBox.style = "visibility: visible; -webkit-transform: none; transform: none; height: 50%; top: 25%; -webkit-opacity: 1.0; -o-opacity: 1.0; -moz-opacity: 1.0; opacity: 1.0;";
        uploadContainer.style = "display: block; width: 100%;";
        previewAgain.style = "visibility: visible; display:block;";

        upload.value = null;

        if (img.src) {
          updateImage();
        } else {
          addImage();
        }

        function updateImage() {
          img.removeAttribute('src');
          img.setAttribute('src', previewSrc);
          img.parentNode.setAttribute('download', fileName);
          img.parentNode.setAttribute('href', addedBlob);
          updateImageData();
        }

        function addImage() {
          img.setAttribute('src', previewSrc);
          img.parentNode.parentNode.style = "display: block;";
          img.parentNode.setAttribute('download', fileName);
          img.parentNode.setAttribute('href', addedBlob);
          updateImageData();
        }

        function updateImageData() {
          var obj = JSON.parse(data.todo[position]);
          obj.img = img.src;
          obj.imgName = fileName;
          var stringObj = JSON.stringify(obj);
          data.todo.splice(position, 1, stringObj);
          dataObject();
        }
      }
    }

    document.getElementById('time').onchange = function() {
        timeValue.innerText = this.value;
        var now = new Date().getTime();
        var time = this.value;
        var countDownDate = new Date(time).getTime();

        if (now >= countDownDate) {
          alert('Invalid Time...You must pick a time in the future');
          document.getElementById('time').value = "";
        } else {
          countDown();
        }
    }

    function countDown() {
      var time = document.getElementById('time').value;
      countDownTimer.style = "display: block;";
      var complete = document.getElementById('complete');

      var countDownDate = new Date(time).getTime();

      var obj = JSON.parse(data.todo[position]);
      obj.timeValue = countDownDate;
      var stringObj = JSON.stringify(obj);
      data.todo.splice(position, 1, stringObj);
      dataObject();
      countDownFunction(countDownDate, countDownTimer);

      document.getElementById('time').value = null;
    }
  }
}

function countDownFunction(countDownDate, countDownTimer) {
  var x = setInterval(function() {

    var now = new Date().getTime();

    var distance = countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (days === 0) {
            countDownTimer.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
        if (hours === 0) {
            countDownTimer.innerHTML = minutes + "m " + seconds + "s ";
            if (minutes === 0) {
                countDownTimer.innerHTML = seconds + "s ";
            }
        }
    } else {
      countDownTimer.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    }

    if (distance < 0) {
         clearInterval(x);
         countDownTimer.innerHTML = "TIMES UP!";
         countDownTimer.style = "display: block; color: #e74c3c;";
       }

    var list = countDownTimer.parentNode.parentNode;

    if (list === complete) {
      clearInterval(x);
      countDownTimer.style = "display: none;"
      countDownTimer.innerHTML = "";
    }
  }, 100)
}

// Change styling stuff
function previewImage() {
  file.style = "visibility:visible; display:block;";
  document.getElementById('upload-contain').style = "width:calc(100% - 34px); float: right;";
  document.getElementById('header').style = "height:190px;";
  document.getElementById('item').style = "padding: 20px 0px 131px 0px;";
  document.getElementById('todo').style = "top: 200px;";
  document.getElementById('complete').style = "top:200px;";
  document.getElementById('upload-label').style = "mix-blend-mode: difference;"
}
// Preview File
function previewFile() {
  file.style = "visibility: visible; display: block; width: 30px; height: 30px;";
  document.getElementById('upload-contain').style = "visibility: visible; display: block; width: 30px; height: 30px; bottom: 25pt; float: right; margin-right:0;";
}

// Reseting changed styling
function previewFileOff() {
  file.removeAttribute('style');
  file.removeAttribute('src');
  document.getElementById('upload-contain').removeAttribute('style');
  document.getElementById('header').removeAttribute('style');
  document.getElementById('item').removeAttribute('style');
  document.getElementById('todo').removeAttribute('style');
  document.getElementById('complete').removeAttribute('style');
  document.getElementById('upload-label').removeAttribute('style');
}
