function getRequest(url,success, error){
  callAjax('GET', url,null, success,error);
}

function postRequest(url,data,success, error){
  callAjax('POST',url,data,success,error );
}

function deleteRequest(url,success,error){
  callAjax('DELETE', url, null, success, error);
}

function putRequest(url, data, success, error){
  callAjax('PUT', url, data, success,error );
}

function callAjax(method, url, data,successcb,errorcb){
  $.ajax({
    method: method,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    url: url,
    data: JSON.stringify(data),
    success: successcb,
    error: errorcb
});
}

define(function(){
  return {
      getRequest: getRequest,
      postRequest: postRequest,
      deleteRequest: deleteRequest,
      putRequest: putRequest
  };
});
