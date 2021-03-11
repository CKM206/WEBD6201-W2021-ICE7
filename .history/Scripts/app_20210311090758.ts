namespace core
{

  function addLinkEvents(): void
  {
    // Loop through ach anchor tag of the unordered List (page links)
    //-Add event listener / handler to allow for
    // Content injection
    $("ul>li>a").on("click", function()
    {
      loadLink($(this).attr("id"));
    });
      
    $("ul>li>a").on("mouseover", function()
    {
      $(this).css('cursor', 'pointer');
    });
  }


  /**
   *  loadLink(string) - A custom page loading function that will replace
   *                   href links, ensuring proper page loading on 
   *                   deployment. Optionally, each loaded link may also include
   *                   optional data using the data arg.
   * @param {string} link 
   * @param {string }data [data=""]
   */
  function loadLink(link: string, data: string = ""): void
  {
    $(`#${router.ActiveLink}`).removeClass("active");
    router.ActiveLink = link;
    router.LinkData = data;
    loadContent(router.ActiveLink, ActiveLinkCallback(router.ActiveLink));
    $(`#${router.ActiveLink}`).addClass("active");
    history.replaceState({}, "", router.ActiveLink);
  }


  /**
   * Inject the Navigation Bar into the header element and highlight the active link based on the pageName paramater
   * @param {string} pageName Inject the Navigation Bar
   * @returns {void}
   */
  function loadHeader(pageName: string): void
  {
    $.get("./Views/components/header.html", function(data)
    {
      // Load the Header Data
      $("header").html(data);

      // Highlight the Active Page
      $(`#${pageName}`).addClass("active");

      addLinkEvents();

    });
    
  }


  /**
   * Injects page content into the Main element
   * @param {string} pageName 
   * @param {Function} callback 
   * @returns {void}
   */
  function loadContent(pageName: string, callback: Function): void
  {
    $.get(`./Views/content/${pageName}.html`, function(data)
        {
          $("main").html(data);

          // Must be placed here so that we can confirm that content has loaded!
          toggleLogin();
          callback();
        });

  }

  /**
   * Loads the footer of each page
   * @returns {void}
   */
  function loadFooter(): void
  {
    $.get("./Views/components/footer.html", function(data)
        {
          $("footer").html(data);
        });
  }


    function displayHome(): void
    {
        console.log("Home Page Function Called!");
    }

    function displayAbout(): void
    {

    }

    function displayProjects(): void
    {

    }

    function displayServices(): void
    {

    }

    function testFullName(): void
    {
      let messageArea = $("#messageArea").hide();
      let fullNamePattern = /([A-Z][a-z]{1,25})+(\s|,|-)([A-Z][a-z]{1,25})+(\s|,|-)*/;

        
        $("#fullName").on("blur", function()
        {
          if(!fullNamePattern.test($(this).val().toString()))
          {
            $(this).trigger("focus").trigger("select");
            messageArea.show().addClass("alert alert-danger").text("Please enter a valid Full Name. This must include at least a Capitalized first name followed by a Capitlalized last name.");
          }
          else
          {
              messageArea.removeAttr("class").hide();
          }
        });
    }

    function testContactNumber(): void
    {
      let messageArea = $("#messageArea");
      let contactNumberPattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        
        $("#contactNumber").on("blur", function()
        {
          if(!contactNumberPattern.test($(this).val().toString()))
          {
            $(this).trigger("focus").trigger("select");
            messageArea.show().addClass("alert alert-danger").text("Please enter a valid Contact Number. Country code and area code are both optional");
          }
          else
          {
              messageArea.removeAttr("class").hide();
          }
        });
    }

    function testEmailAddress(): void
    {
      let messageArea = $("#messageArea");
      let emailAddressPattern = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
        
        $("#emailAddress").on("blur", function()
        {
          if(!emailAddressPattern.test($(this).val().toString()))
          {
            $(this).trigger("focus").trigger("select");
            messageArea.show().addClass("alert alert-danger").text("Please enter a valid Email Address.");
          }
          else
          {
              messageArea.removeAttr("class").hide();
          }
        });
    }

    function formValidation(): void
    {
      testFullName();
      testContactNumber();
      testEmailAddress();
    }

    function displayContact(): void
    {
      // form validation
      formValidation();

        $("#sendButton").on("click", (event)=> 
        {
          // Get each InputElement from the page
          let subscribeCheckbox = $("#subscribeCheckbox")[0] as HTMLInputElement;
          let fullName = $("#fullName")[0] as HTMLInputElement;
          let contactNumber = $("#contactNumber")[0] as HTMLInputElement;
          let emailAddress = $("#emailAddress")[0] as HTMLInputElement;


          // Use the InputElements for checking
          if(subscribeCheckbox.checked)
          {
            let contact = new core.Contact(fullName.value, contactNumber.value, emailAddress.value);

            if(contact.serialize())
            {
              let key = contact.FullName.substring(0, 1) + Date.now();

              localStorage.setItem(key, contact.serialize());
            }
          }
        });
    }

    function displayContactList(): void
    {
      // First Check to see if someone is logged in
      authGuard();

      if (localStorage.length > 0) 
      {

        let contactList = document.getElementById("contactList");

        let data = "";

        let keys = Object.keys(localStorage);
         
        let index = 1;

        for (const key of keys) 
        {
          let contactData = localStorage.getItem(key);

          let contact = new core.Contact();
          contact.deserialize(contactData);

          data += `<tr>
          <th scope="row" class="text-center">${index}</th>
          <td>${contact.FullName}</td>
          <td>${contact.ContactNumber}</td>
          <td>${contact.EmailAddress}</td>
          <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
          <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
          </tr>`;

          index++;
        }

        contactList.innerHTML = data;

        $("button.edit").on("click", function(){
          // Load the edit page, include the data to be passed 
          //-to the link
          loadLink("edit", $(this).val().toString());
         });

         $("button.delete").on("click", function(){
           if(confirm("Are you sure?"))
           {
            localStorage.removeItem($(this).val().toString());
           }
           loadLink("contact-list"); // refresh the page
         });

         $("#addButton").on("click", function() 
         {
          loadLink("edit");
          
         });
      }
    }

    function displayEdit(): void
    {
      // Get the linkData from router, remember this data is given
      //-to router when linking to the edit page through contact-list
      let key = router.LinkData;

      let contact = new core.Contact();

      // check to ensure that the key is not empty
      if(key != "")
      {
        // get contact info from localStorage
        contact.deserialize(localStorage.getItem(key));

        // display contact information in the form
        $("#fullName").val(contact.FullName);
        $("#contactNumber").val(contact.ContactNumber);
        $("#emailAddress").val(contact.EmailAddress);
      }
      else
      {
        // modify the page so that it shows "Add Contact" in the header 
        $("main>h1").text("Add Contact");
        // modify edit button so that it shows "Add" as well as the appropriate icon
        $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);
      }

      // form validation
      formValidation();
      
     $("#editButton").on("click", function() 
        {
            // check to see if key is empty
          if(key == "")
          {
            // create a new key
            key = contact.FullName.substring(0, 1) + Date.now();
          }

          // copy contact info from form to contact object
          contact.FullName = $("#fullName").val().toString();
          contact.ContactNumber = $("#contactNumber").val().toString();
          contact.EmailAddress = $("#emailAddress").val().toString();

          // add the contact info to localStorage
          localStorage.setItem(key, contact.serialize());

          // return to the contact list
          location.href = "/contact-list";
          
        });
   

      $("#cancelButton").on("click", function()
      {
        // return to the contact list
        loadLink("contact-list");
      });
    }

    function displayLogin(): void
    {
      let messageArea = $("#messageArea");
      messageArea.hide();

      $("#loginButton").on("click", function() 
      {
        let username = $("#username");
        let password = $("#password");
        let success = false;
        let newUser = new core.User();

        // use ajax to access the json file
        $.get("./Data/users.json", function(data)
        {
          // check each user in the users.json file  (linear search)
          for (const user of data.users) 
          {
            if(username.val() == user.Username && password.val() == user.Password)
            {
              newUser.fromJSON(user);
              success = true;
              break;
            }
          }

          // if username and password matches - success... then perform login
          if(success)
          {
            // add user to session storage
            sessionStorage.setItem("user", newUser.serialize());

            // hide any error message
            messageArea.removeAttr("class").hide();
            

            // redirect user to secure area - contact-list.html
            loadLink("contact-list");
          }
          else
          {
            // display an error message
            username.trigger("focus").trigger("select");
            messageArea.show().addClass("alert alert-danger").text("Error: Invalid login information");
          }
        });
      });

      $("#cancelButton").on("click", function()
      {
        // clear the login form
        document.forms[0].reset();
        // return to the home page
        loadLink("home");
      });
    }

    function displayRegister(): void
    {

    }

    function display404() : void
    {

    }

    function toggleLogin() : void
    {

      console.log("Toggled Login");
      // if user is logged in
      if(sessionStorage.getItem("user"))
      {
        // swap out the login link for logout
        $("#loginListItem").html(
        `<a id="logout" class="nav-link" aria-current="page"><i class="fas fa-sign-out-alt"></i> Logout</a>`
        );

        $("#logout").on("click", function()
        {
          // perform logout
          sessionStorage.clear();

          // redirect back to login
          loadLink("login");
        });

        $("#logout").on("mouseover", function()
        {
          $(this).css('cursor', 'pointer');
        });
       
        // Make a reference to the contactListLink 
        let contactListLink = $("#contactListLink")[0]
        // Check if the contactListLink exists
        if (contactListLink)
        {
          // If it doesnt, create it!
          $(`<li class="nav-item">
          <a id="contactListLink" class="nav-link" aria-current="page"><i class="fas fa-users fa-lg"></i> Contact List</a>
          </li>`).insertBefore("#loginListItem");
        }
              
      }
      else
      {
        // swap back the login link for logout
        $("#loginListItem").html(
          `<a id="login" class="nav-link" aria-current="page"><i class="fas fa-sign-in-alt"></i> Login</a>`
          );

       
      }

      addLinkEvents();
    }

    function authGuard(): void
    {
      // check if the user is not logged in
      if(!sessionStorage.getItem("user"))
      {
        // redirect back to login page
        loadLink("login");
      }
    }

    /**
     *  This function associates and returns a related Callback to a route
     * @param activeLink 
     * @returns {Function}
     */
    function ActiveLinkCallback(activeLink: string): Function
    {
      switch (activeLink) 
        {
          case "home": return displayHome;
          case "about": return displayAbout;
          case "projects": return displayProjects;
          case "services": return displayServices;
          case "contact": return displayContact;
          case "contact-list": return displayContactList;
          case "edit": return displayEdit;
          case "login": return displayLogin;
          case "register": return displayRegister;
          case "404": return display404;
          default:
            console.error("ERROR: Callback does not exist " + activeLink);
            break;

        }
    }

    /**
     * This is the Entry-Point for the program program
     */
    function Start(): void
    {
        console.log("App Started...");
        loadHeader(router.ActiveLink);
        loadContent(router.ActiveLink, ActiveLinkCallback(router.ActiveLink));
        loadFooter();
        
    }

    window.addEventListener("load", Start);

}