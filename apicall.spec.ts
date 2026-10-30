import { test, expect, request } from "@playwright/test"
import { title } from "node:process";
let arpitId: string; let url: any;
test('mypractise test1 on api get call', async ({ request }) => {

    url = 'https://reqres.in/';
    const response = await request.post(url + 'api/users', {

        data: {
            "name": "Arpit tomar", "job": "qa automation",
            "salary": "50000"
        }
    })
    expect(response.status()).toBe(201)
    const user1 = await response.json();
    arpitId = user1.id
    console.log(arpitId);
})
test('arpit id verification', async ({ request }) => {
    expect(arpitId).toBeDefined();
    const updatingData = await request.put(url + 'api/users/' + arpitId, {
        data: { "name": "tanu tomar" }
    })
    console.log("the updated data is:", await updatingData.json());
})





test.describe('my chat gpt test1 on post method', async () => {
    test(`test1`, async ({ request }) => {
        const url = 'https://jsonplaceholder.typicode.com'
        const response = await request.post(url + '/posts', {
            data: {
                title: "Playwright API Testing",
                body: "Learning API automation",
                userId: 5
            }
        })
        console.log("here is the created data:",await response.json());
        expect(response.status()).toBe(201);
        console.log("actual http status of the user:", response.status());
        
        
    })
})