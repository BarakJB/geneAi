function handler(event) {
    var request = event.request;
    var headers = request.headers;
    var host = headers.host.value;
    
    // אם הבקשה מגיעה מ-geneai.co.il (ללא www), עשה redirect
    if (host === 'geneai.co.il') {
        var response = {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                'location': { value: 'https://www.geneai.co.il' + request.uri }
            }
        };
        return response;
    }
    
    // אחרת, המשך רגיל
    return request;
}
