import $ from 'jquery';


class Client {

    LOCAL_STORAGE_KEY = "token_key";
    LOCAL_STORAGE_LOGIN_DATA = "login_data"

    setToken = (token) => {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, token);
    }

    removeToken = () => {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
        localStorage.removeItem(this.LOCAL_STORAGE_LOGIN_DATA)
    }

    logout = () => {
        $.ajax({
            url: '/logout',
            type: "POST",
            dataType: 'json',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(this.LOCAL_STORAGE_KEY)}`,
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
        if (!localStorage.getItem(this.LOCAL_STORAGE_KEY)){
            return false
        }else{
            $.ajax({
                url: '/status',
                type: "GET",
                dataType: 'json',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(this.LOCAL_STORAGE_KEY)}`,
                },
                contentType: 'application/json',
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                success: (result) => {
                  console.log(result.data.user_id)
                  localStorage.setItem(this.LOCAL_STORAGE_LOGIN_DATA, result.data.user_id);
                  return result;
                },
                error: (error) => {
                  localStorage.removeItem(this.LOCAL_STORAGE_LOGIN_DATA)
                  alert(error.responseJSON.message)
                  return error;
                }
            });

        }
    }

    isLoggedIn = () => {
      this.getStatus()
      console.log(localStorage.getItem(this.LOCAL_STORAGE_LOGIN_DATA))
      return localStorage.getItem(this.LOCAL_STORAGE_LOGIN_DATA)?true:false;
    }
}

var client = new Client()
export default client