import { describe, expect, it } from "vitest";
import { buildOAuthConfigPayload } from "./mcpClientOAuthPayload";

const raw = { serverURL: "https://mcp.linear.app/mcp", scopesText: "", resourceText: "" };

describe("buildOAuthConfigPayload", () => {
	it("sends the client metadata document toggle without a client ID or secret", () => {
		const payload = buildOAuthConfigPayload(
			{
				client_id: { value: "typed-before-toggling", ref: "" },
				client_secret: { value: "secret", ref: "" },
				use_client_metadata_document: true,
			},
			raw,
		);
		expect(payload.use_client_metadata_document).toBe(true);
		expect(payload.client_id.value).toBe("");
		expect(payload.client_secret).toBeUndefined();
		expect(payload.redirect_uri_override).toBeUndefined();
	});

	it("leaves the toggle out and keeps the client ID and secret when it is off", () => {
		const payload = buildOAuthConfigPayload({ client_id: { value: "preset", ref: "" }, client_secret: { value: "secret", ref: "" } }, raw);
		expect(payload.use_client_metadata_document).toBeUndefined();
		expect(payload.client_id.value).toBe("preset");
		expect(payload.client_secret?.value).toBe("secret");
	});

	it("trims and sends a custom redirect URI", () => {
		const payload = buildOAuthConfigPayload(
			{ client_id: { value: "", ref: "" }, redirect_uri_override: "  http://localhost:8765/api/oauth/callback  " },
			raw,
		);
		expect(payload.redirect_uri_override).toBe("http://localhost:8765/api/oauth/callback");
	});
});