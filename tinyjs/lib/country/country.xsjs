async function saveCountry(country) {

	let conn;
	let output = JSON.stringify(country);
	let fnCreateCountry;
	let result;

	try {
		conn = await $.hdb.getConnection();
		fnCreateCountry = await conn.loadProcedure("tinyworld.tinydb::createCountry");
		result = await fnCreateCountry({
			IM_COUNTRY: country.name,
			IM_CONTINENT: country.partof
		});

		if ( result && result.EX_ERROR != null ) {
			return result.EX_ERROR;
		} else {
			await conn.commit();
		}
	} finally {
		if (conn) {
			await conn.close();
		}   	
	}
   
   	return output;
}

var country = {
	name: $.request.parameters.get("name"),
	partof: $.request.parameters.get("continent")
};

// validate the inputs here!
var output = await saveCountry(country);

$.response.contentType = "application/json";
$.response.setBody(output);
//$.response.setStatus = output.status;