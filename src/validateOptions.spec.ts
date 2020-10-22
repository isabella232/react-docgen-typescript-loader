import validateOptions from "./validateOptions";

it("throws error on unexpected field", () => {
  expect(() => validateOptions({ invalidField: "fail" } as any)).toThrowError(
    /invalidField.*invalid additional property/,
  );
});

it("does not throw on empty", () => {
  expect(() => validateOptions()).not.toThrow();
});

describe("compilerOptions", () => {
  it("accepts object of any shape", () => {
    expect(() =>
      validateOptions({
        compilerOptions: {
          option: "test",
          otherOption: { secondField: "test" },
        },
      } as any),
    ).not.toThrow();
  });
});

describe("v2 includes/excludes fields", () => {
  it("throws error if included", () => {
    expect(() =>
      validateOptions({
        includes: ["*\\.stories\\.tsx$"],
      } as any),
    ).toThrowError(/includes.*is an invalid additional property/);
  });
});
