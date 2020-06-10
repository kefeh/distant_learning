import $ from 'jquery';

let LOCAL_STORAGE_KEY = "token_key";

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

    isLoggedIn = () => {
        var registered_time = null;
        if (!localStorage.getItem(LOCAL_STORAGE_KEY)){
            return false
        }else{
            $.ajax({
                url: '/status',
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
                    registered_time = result.registered_on
                  return;
                },
                error: (error) => {
                  alert(error.responseJSON.message)
                  return;
                }
            })
        }
        console.log(registered_time)
        if(registered_time){
            return true
        }else{
            return false
        }
    }
}

var client = new Client()
export default client