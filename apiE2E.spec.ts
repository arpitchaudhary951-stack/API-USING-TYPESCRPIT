import { test, expect } from "@playwright/test";
import fs, { readFileSync } from 'fs';

function apiPathFunction(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
const BASE_URL = 'https://restful-booker.herokuapp.com';

test('sending post request then get then patch then put and lastly send delete request', async ({ request }) => {
    const post_fileJson = apiPathFunction("myTests/postBooking.json");
    const requestPost = await request.post(`${BASE_URL}/booking`, {
        data: post_fileJson
    })
    const PostJsonBody = await requestPost.json();
    console.log('post payload body', PostJsonBody);

    const BookingId = PostJsonBody.bookingid

    expect(requestPost.status()).toBe(200);
    expect(requestPost.statusText()).toBe("OK");
    expect(PostJsonBody).toMatchObject(PostJsonBody);
    expect(PostJsonBody.booking.depositpaid).toEqual(expect.any(Boolean));

    // checking is our post request payload body is successfully processed or not=========
    const get_response = await request.get(`${BASE_URL}/booking/${BookingId}`)
    const getResponseJson = await get_response.json();
    console.log("get request data body response", getResponseJson);

    expect(get_response.status()).toBe(200);
    expect(get_response.statusText()).toBe("OK");
    expect(getResponseJson).toMatchObject(getResponseJson);
    expect(getResponseJson.depositpaid).toEqual(expect.any(Boolean));


    // before making request for patch put and delete we have to generate token so,generating tokens==
    const Token_generate = await request.post(`${BASE_URL}/auth`, {
        headers: { 'Content-Type': 'application/json' },
        data: {
            "username": "admin",
            "password": "password123"
        }
    })
    const tokenJson = await Token_generate.json();
    const token=tokenJson.token
    console.log("here is the token", token);
    expect(Token_generate.ok()).toBeTruthy();
    expect(Token_generate.status()).toBe(200);
    expect(Token_generate.statusText()).toBe("OK");

    // partially updating the data using patch request========
    const readJsonPatch = apiPathFunction('myTests/patchsBooking.json')
    const patch_response = await request.patch(`${BASE_URL}/booking/${BookingId}`, {

        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `token=${token}`
        },
        data: 
            readJsonPatch
        
    })
    const patchJsonBody = await patch_response.json()
    console.log("response body after using patch request", patchJsonBody);
    expect(patch_response.status()).toBe(200);
    expect(patch_response.statusText()).toBe("OK");
    expect(patchJsonBody).toMatchObject(patchJsonBody);
    

    // full update by using put request in api=========
    const patch_readJsonFile=apiPathFunction('myTests/putBooking.json')
    const put_response=await request.put(`${BASE_URL}/booking/${BookingId}`, {

        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `token=${token}`
        },
        data: 
            patch_readJsonFile
        
    })
    const putJsonbody=await put_response.json()
    console.log("after complete updatation",putJsonbody);
    expect(put_response.status()).toBe(200);
    expect(put_response.statusText()).toBe("OK");
    expect(putJsonbody).toMatchObject(putJsonbody);

    // now lastly delete the entire resorce or data from the server========
    const deleteResponse=await request.delete(`${BASE_URL}/booking/${BookingId}`, {

        headers: {
            'Content-Type': 'application/json',
            'Cookie': `token=${token}`
        }
    });
  expect(deleteResponse.status()).toBeTruthy();
})