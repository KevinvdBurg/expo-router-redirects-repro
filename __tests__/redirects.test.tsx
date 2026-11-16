import { Stack } from "expo-router";
import { renderRouter, screen } from "expo-router/testing-library";
import { Text } from "react-native";

let mockRedirects: { source: string; destination: string }[] = [];

jest.mock("expo-constants", () => {
  const actual = jest.requireActual("expo-constants").default;
  return {
    __esModule: true,
    default: new Proxy(actual, {
      get: (target, key) =>
        key === "expoConfig"
          ? { ...target.expoConfig, extra: { router: { redirects: mockRedirects } } }
          : target[key],
    }),
  };
});

describe("redirect source matches as a prefix", () => {
  it("does not redirect /old/123 when the source is /old", async () => {
    mockRedirects = [{ source: "/old", destination: "/new" }];
    await renderRouter(
      {
        index: () => <Text>home</Text>,
        new: () => <Text>new</Text>,
        "old/[id]": () => <Text>old detail</Text>,
      },
      { initialUrl: "/old/123" }
    );
    expect(await screen.findByText("old detail")).toBeOnTheScreen();
  });

  it("redirects /invoices to /invoices/list without a stack overflow", async () => {
    mockRedirects = [{ source: "/invoices", destination: "/invoices/list" }];
    await renderRouter(
      {
        index: () => <Text>home</Text>,
        "invoices/list": () => <Text>invoice list</Text>,
      },
      { initialUrl: "/invoices" }
    );
    expect(await screen.findByText("invoice list")).toBeOnTheScreen();
  });
});

describe("redirect fallback route with Stack.Protected", () => {
  const routes = {
    _layout: () => (
      <Stack>
        <Stack.Protected guard={false}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={true}>
          <Stack.Screen name="login" />
        </Stack.Protected>
      </Stack>
    ),
    login: () => <Text>login</Text>,
    "(auth)/_layout": () => <Stack />,
    "(auth)/index": () => <Text>home</Text>,
    "(auth)/secret": () => <Text>secret</Text>,
  };

  it.each(["/old", "/old-secret-page"])(
    "shows login when logged out with a %s redirect",
    async (source) => {
      mockRedirects = [{ source, destination: "/secret" }];
      await renderRouter(routes, { initialUrl: "/" });
      expect(await screen.findByText("login")).toBeOnTheScreen();
    }
  );
});
