import $ from 'jquery';

let LOCAL_STORAGE_KEY = "token_key";
let LOCAL_STORAGE_LOGIN_DATA = "login_data"

class Client {

    setToken = (token) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, token);
    }

    removeToken = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    logout = () => {
        $.ajax({
            url: '/logout',
            type: "POST",
            dataType: 'json',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY)}`,
            },
            contentType: 'application/json',
            data: JSON.stringify({}),
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: (result) => {
                alert(result.message)
              return;
            },
            error: (error) => {
              alert(error.responseJSON.message)
              return;
            }
        })
        this.removeToken();
    }

    getStatus = () => {
        if (!localStorage.getItem(LOCAL_STORAGE_KEY)){
            return false
        }else{
            $.ajax({
                url: '/status',
                type: "GET",
                dataType: 'json',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY)}`,
                },
                contentType: 'application/json',
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                success: (result) => {
                  localStorage.setItem(LOCAL_STORAGE_LOGIN_DATA, result);
                  return result;
                },
                error: (error) => {
                  alert(error.responseJSON.message)
                  localStorage.removeItem(LOCAL_STORAGE_LOGIN_DATA)
                  return error;
                }
            });

        }
    }

    isLoggedIn = () => {
      this.getStatus()
      console.log(localStorage.getItem(LOCAL_STORAGE_LOGIN_DATA))
      return localStorage.getItem(LOCAL_STORAGE_LOGIN_DATA)?true:false;
    }
}

var client = new Client()
export default client