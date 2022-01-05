const firebaseConfig = {
  apiKey: "AIzaSyCuCBQfKjcCw9UtNJblTRbm1uyLwS5YtQI",
  authDomain: "javascript-firebase-assignment.firebaseapp.com",
  projectId: "javascript-firebase-assignment",
  storageBucket: "javascript-firebase-assignment.appspot.com",
  messagingSenderId: "423016643124",
  appId: "1:423016643124:web:06dcaa84b2611680b9e861",
};

//Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Initialize auth function
const auth = firebase.auth();

// Global variables
const linkCreateAccount = document.querySelector("#linkCreateAccount");
const linkLogin = document.querySelector("#linkLogin");
const loginForm = document.querySelector("#signIn");
const signupForm = document.querySelector("#signUp")
const firstName = document.getElementById("fName");
const lastName = document.getElementById("lName");
const dateOfBirth = document.getElementById("birthDate");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupBtn = document.getElementById("signup-btn");
const signinEmail = document.getElementById("signIn-email");
const signinPassword = document.getElementById("signIn-password");
const signinBtn = document.getElementById("signIn-btn");
const signoutBtn = document.getElementById("signOut-btn");



// Toggle between Login Form and Sign-up Form
const toggleForm = function() {

  if (linkCreateAccount != null) {
    document
      .querySelector("#linkCreateAccount")
      .addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        signupForm.classList.remove("form--hidden");
      });
  }

  if (linkLogin != null) {
    document.querySelector("#linkLogin").addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.remove("form--hidden");
      signupForm.classList.add("form--hidden");
    });
  }
};

// Sign Up functionality
if (signupBtn !== null) {
  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Take user input and store into temporary variables
    const fNameInput = firstName.value;
    const lNameInput = lastName.value;
    const birthdateInput = dateOfBirth.value;
    const emailInput = signupEmail.value;
    const passwordInput = signupPassword.value;

    // create authentication with email and password
    auth
      .createUserWithEmailAndPassword(emailInput, passwordInput)
      .then((userCredential) => {
        let user = userCredential.user.email;
        console.log("User created: ", user);
       
        // Save input data as Realtime Database key:value pairs
        let newUser = {
          FirstName: fNameInput,
          LastName: lNameInput,
          Birthdate: birthdateInput,
          Email: emailInput,
        };
        //Reset sign-up form 
        signupForm.reset();

        // postToFirebase(obj);
        postToFirebaseUserDefinedId(newUser);

        //Sign-in functionality on new user signup
        console.log("User logged in: ", user);
        document.getElementById("afterLogin").style.display = "block";
        displayGreetings(); //calls the displayGreetings function
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });

  });
    
}

//User Defined UID
function postToFirebaseUserDefinedId(obj) {
  const ref = firebase.database().ref("Users");
  const user_key = firebase.auth().currentUser.uid;
  const ref2 = ref.child(user_key);
  ref2.set(obj);
}

// Sign In functionality
if (signinBtn !== null) {
  signinBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const emailInput = signinEmail.value;
    const passwordInput = signinPassword.value;

    // Check user authentication for correct email password combination
    auth
      .signInWithEmailAndPassword(emailInput, passwordInput)
      .then((userCredential) => {
        let user = userCredential.user.email;
        console.log("User logged in: ", user);

        //Reset sign-up form 
        loginForm.reset();

        //Opens after login overlay and calls the displayGreetings function
        document.getElementById("afterLogin").style.display = "block";
        displayGreetings(); 
      })
      .catch((error) => {
        console.log(error);
        alert("Error!");
      });
  });
}

// Add event for Sign out button
if (signoutBtn !== null) {
  signoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    auth
      .signOut()
      .then(() => {
        console.log("User signed Out");
        alert("You have succesfully signed out. Have a nice day!");
        document.getElementById("afterLogin").style.display = "none";
        document.getElementById("isBirthday").classList.add("card--hidden");
        document.getElementById("notBirthday").classList.add("card--hidden");
        document.getElementById("formContainer").classList.remove("container--hidden");
        loginForm.classList.remove("form--hidden"); 
        toggleForm();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  });
}


// Fun starts here

//Check birthday
function checkBirthday(dateOfBirth) {
  let daysLeftForBirthday = "";

  let today = new Date();
  let currentYear = today.getFullYear();
  let nextLeapYear = currentYear + (4 - (currentYear - 2000) % 4);

  let birthday = new Date(dateOfBirth);
  let birthDate = birthday.getDate();
  let birthMonth = birthday.getMonth();
  let birthYear = birthday.getFullYear();

  let constructedBirthday = new Date();
  constructedBirthday.setFullYear(birthYear);
  constructedBirthday.setDate(birthDate);
  constructedBirthday.setMonth(birthMonth);

  console.log(constructedBirthday);

  let nextBirthday = new Date(constructedBirthday).setFullYear(currentYear);
  const diffDays = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

  // Check if current user's birthday falls on 29 Feb
  if (birthMonth === 1 && birthDate===29){
    let nextLeapBirthday = new Date(constructedBirthday).setFullYear(nextLeapYear);
    const diffLeapDays = Math.ceil((nextLeapBirthday - today) / (1000 * 60 * 60 * 24))-1;
    if (currentYear%4 === 0){
      if (diffDays === 0) {
        daysLeftForBirthday = 0;
      } else if (diffDays < 0) {
        daysLeftForBirthday = diffLeapDays;
      } else {
        daysLeftForBirthday = diffDays;
      }
    } else{
      daysLeftForBirthday = diffLeapDays;
    };
    console.log(new Date(nextLeapBirthday));
  } else{
    // For all other users with non-leap-year-birthday
      if (diffDays === 0) {
        daysLeftForBirthday = 0;
      } else if (diffDays < 0) {
        nextBirthday = new Date(constructedBirthday.setFullYear(currentYear + 1));
        const newDiffDays = Math.ceil(
          (nextBirthday - today) / (1000 * 60 * 60 * 24)
        );
        daysLeftForBirthday = newDiffDays;
      } else {
        daysLeftForBirthday = diffDays;
      };
      console.log(new Date(nextBirthday));
  }

  return daysLeftForBirthday;
}

//Get Motivational Quotes from API
function sendHTTPRequest(method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status >= 300) {
        reject(`Error, status code ${xhr.status}: ${xhr.statusText}`);
      } else {
        let data = JSON.parse(xhr.response);
        resolve(data);
      }
    };
    xhr.open(method, url);
    xhr.send();
  });
}

async function getQuotes() {
  let response = await sendHTTPRequest("GET", "https://type.fit/api/quotes");
  let arrayLength = response.length;
  let randomQuoteIndex = Math.floor(Math.random() * arrayLength);
  let randomQuote = response[randomQuoteIndex].text;
  let randomAuthor;
  if (response[randomQuoteIndex].author == null) {
    randomAuthor = "Anonymous";
  } else {
    randomAuthor = response[randomQuoteIndex].author;
  }

  let quote = document.getElementById("randomQuoteText");
  let author = document.getElementById("randomQuoteAuthor");

  quote.innerHTML = `"${randomQuote}"`;
  author.innerHTML = `- ${randomAuthor}`;
}

// The final function that executes all required functions after checking the required conditions
async function displayGreetings() {
  const ref = firebase.database().ref().child("Users");
  const userId = firebase.auth().currentUser.uid;
  console.log(userId);

  ref
    .child(userId)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        let userData = snapshot.val();
        console.log(userData);

        let currentUserBirthday = userData.Birthdate;
        let currentUserName = userData.FirstName;
        let daysToBirthday = checkBirthday(`"${currentUserBirthday}"`);
        console.log(daysToBirthday);
        console.log(currentUserBirthday);
        document.getElementById(
          "welcomeMessage"
        ).innerHTML = `Welcome ${currentUserName}`;

        if (daysToBirthday === 0) {
          getQuotes();
          console.log(`Happy Birthday, ${currentUserName}!`);
          document
            .getElementById("isBirthday")
            .classList.remove("card--hidden");
          document.getElementById(
            "birthdayGreeting"
          ).innerHTML = `Happy Birthday, ${currentUserName}!`;
        } else {
          console.log(`${daysToBirthday} DAYS LEFT`);
          document
            .getElementById("notBirthday")
            .classList.remove("card--hidden");
            if(daysToBirthday === 1){
              document.getElementById(
                "daysLeft"
              ).innerHTML = `ONLY ${daysToBirthday} DAY LEFT`;
            } else if(daysToBirthday <10){
              document.getElementById(
                "daysLeft"
              ).innerHTML = `ONLY ${daysToBirthday} DAYS LEFT`;
              } else {
              document.getElementById(
                "daysLeft"
              ).innerHTML = `${daysToBirthday} DAYS LEFT`;
            }         
          document.getElementById("justText").innerHTML =
            "UNTIL YOUR BIRTHDAY!";
        }
      } else {
        console.log("Data not found");
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
};

function loadPage(){
  // Checks if current user is active or inactive
  auth.onAuthStateChanged((user) => {
    if (user !== null) {
      console.log("State: Active"); //If user is not null, then state is Active
      console.log(user);
      if (linkCreateAccount != null) {
        loginForm.classList.add("form--hidden");
          };
      if (linkLogin != null) {
          signupForm.classList.add("form--hidden");
         };
      document.getElementById('formContainer').classList.add('container--hidden');
      document.getElementById('afterLogin').classList.remove('afterLogin--hidden');
      displayGreetings();
    } else {
      console.log("State: Inactive"); //If user is null, then state is Inactive
      loginForm.classList.remove("form--hidden"); 
      toggleForm();
    }
});
}