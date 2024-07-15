import RootLayout from "@/app/layout";
import { render } from "@testing-library/react";

describe("Layout", () => {

  it("should set web page title to Ourchive", () => {
    let { container } = render(<RootLayout><div></div></RootLayout>);

    let title = container.querySelector("title");
    
    expect(title?.textContent).toBe("Ourkive");
  });

});
