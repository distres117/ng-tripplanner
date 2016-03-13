function getRequest(url,success, error){
  callAjax('GET', url,null, success,error);
}

function postRequest(url,data,success, error){
  callAjax('POST',url,data,success,error );
}

function callAjax(method, url, data,successcb,errorcb){
  $.ajax({
    method: method,
    url: url,
    data: data,
    success: successcb,
    error: errorcb
});
}
