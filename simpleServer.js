const http = require('http');
var fs = require('fs');
var url = require("url");

const server = http.createServer((req, res) => {
	console.log("requestedPath" + req.url)
	var requestedPath= url.parse(req.url).pathname;
	if(requestedPath == "/"){
		fs.readFile('stackedBar.html', function (err, data) {
	        if (err) return console.log(err);
	        res.writeHead(200, { 'Content-Type': 'text/html' });
	        res.end(data, 'utf-8');
	        res.end();
	        console.log("html is read");
	    });
	} else if(requestedPath.indexOf(".json") !=-1){
		fs.readFile('./'+ requestedPath, function (err, data) {
	        if (err) return console.log(err);
	        res.writeHead(200, { 'Content-Type': 'application/json' });
	        res.end(data, 'utf-8');
	        res.end();
	        console.log("Json is read");
	    });
	}else if(requestedPath.indexOf(".js") !=-1){
		fs.readFile('./'+requestedPath, function (err, data) {
	        if (err) return console.log(err);
	        res.writeHead(200, { 'Content-Type': 'application/javascript' });
	        res.end(data, 'utf-8');
	        res.end();
	        console.log("javascript is read");
	    });
	} else if(requestedPath.indexOf("addARow.html") !=-1){
		requestedPath=req.url;
		var CountryName,CountryCode,IndicatorName,IndicatorCode,Year,Value;
		var headers = ["CountryName","CountryCode","IndicatorName","IndicatorCode","Year","Value"];
		var replace = require("replace");
			replace({
			    regex: "]",
			    replacement: ",",
			    paths: ['./js/asian_rural_population.json'],
			    recursive: true,
			    silent: true,
			});
		if(requestedPath.indexOf("countryName")!=-1){
			CountryName = (requestedPath.substring(requestedPath.indexOf("countryName")+12)).substring(0,requestedPath.substring(requestedPath.indexOf("countryName")+12).indexOf("&"));
			CountryCode = CountryName.substring(0,3).toUpperCase();
		}
		if(requestedPath.indexOf("indicatorName")!=-1){
			IndicatorName = (((requestedPath.substring(requestedPath.indexOf("indicatorName")+14)).substring(0,requestedPath.substring(requestedPath.indexOf("indicatorName")+14).indexOf("&"))).split("+")).join(" ");
			if(IndicatorName == "Urban population"){
				IndicatorCode = "SP.URB.TOTL";
			}else{
				IndicatorCode = "SP.RUR.TOTL";
			}
		}
		if(requestedPath.indexOf("year")!=-1){
			Year = (requestedPath.substring(requestedPath.indexOf("year")+5)).substring(0,requestedPath.substring(requestedPath.indexOf("year")+5).indexOf("&"));
		}
		if(requestedPath.indexOf("value")!=-1){
			Value = requestedPath.substring(requestedPath.indexOf("value")+6);
		}
		var param = [CountryName,CountryCode,IndicatorName,IndicatorCode,Year,Value];
		console.log(param);
		var obj = {};
		  for(var i=0;i<headers.length;i++){
		       obj[headers[i]] = param[i];
		  }
    	var objJson = JSON.stringify(obj);
    	console.log(objJson);
  		fs.appendFile('./js/asian_rural_population.json', objJson +"]", function (err) {
  			if (err) throw err;
  			console.log('Json updated');
		});
		fs.readFile('stackedBar.html', function (err, data) {
	        if (err) return console.log(err);
	        res.writeHead(200, { 'Content-Type': 'text/html' });
	        res.end(data, 'utf-8');
	        res.end();
	        console.log("html is read");
	    });
	}
}).listen(8080);
console.log("Server Running");
