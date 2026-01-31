import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ChatInput from "./ChatInput.vue";

describe("ChatInput", () => {
  it("emits submit event with message when form is submitted", async () => {
    const wrapper = await mountSuspended(ChatInput);
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find("form");

    await input.setValue("Test message");
    await form.trigger("submit");

    expect(wrapper.emitted("submit")).toBeTruthy();
    expect(wrapper.emitted("submit")![0]).toEqual(["Test message"]);
  });

  it("clears input after submission", async () => {
    const wrapper = await mountSuspended(ChatInput);
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find("form");

    await input.setValue("Test message");
    await form.trigger("submit");

    expect((input.element as HTMLInputElement).value).toBe("");
  });

  it("does not emit submit for empty message", async () => {
    const wrapper = await mountSuspended(ChatInput);
    const form = wrapper.find("form");

    await form.trigger("submit");

    expect(wrapper.emitted("submit")).toBeFalsy();
  });

  it("does not emit submit for whitespace-only message", async () => {
    const wrapper = await mountSuspended(ChatInput);
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find("form");

    await input.setValue("   ");
    await form.trigger("submit");

    expect(wrapper.emitted("submit")).toBeFalsy();
  });

  it("submits on Enter key press", async () => {
    const wrapper = await mountSuspended(ChatInput);
    const input = wrapper.find('input[type="text"]');

    await input.setValue("Test message");
    await input.trigger("keypress", { key: "Enter" });

    expect(wrapper.emitted("submit")).toBeTruthy();
    expect(wrapper.emitted("submit")![0]).toEqual(["Test message"]);
  });

  it("matches snapshot", async () => {
    const wrapper = await mountSuspended(ChatInput);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
