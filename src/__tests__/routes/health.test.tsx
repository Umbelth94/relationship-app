/**
 * @jest-environment node
 */

import { GET } from "@/app/api/health/route";

describe("Health Endpoint", () => {
  it("should return up", async () => {
    const resp = await GET();
    const expectedResult = { status: "up" };

    const jsonData = await resp.json();

    expect(jsonData).toEqual(expectedResult);
  });
});
