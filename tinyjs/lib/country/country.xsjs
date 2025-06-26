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

		if (result && result.EX_ERROR != null) {
			return {
				body: result,
				status: $.net.http.BAD_REQUEST
			};
		} else {
			await conn.commit();

			return {
				body: output,
				status: $.net.http.CREATED
			};
		}
	} finally {
		if (conn) {
			await conn.close();
		}
	}

	return "";
}

var body = $.request.body.asString();
var country = JSON.parse(body);

// validate the inputs here!
var output = await saveCountry(country);

$.response.contentType = "application/json";

$.response.setBody(output.body);
$.response.setStatus = output.status;