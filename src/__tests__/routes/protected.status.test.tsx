/**
 * @jest-environment node
 */

import { GET } from "@/app/api/protected/status/route";

describe("Health Endpoint", () => {
  it("should return up", async () => {
    const resp = await GET();
    const expectedResult = { message: "You are authorized" };

    const jsonData = await resp.json();

    expect(jsonData).toEqual(expectedResult);
  });
});
