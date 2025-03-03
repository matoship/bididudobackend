"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = test;
exports.claude = claude;
/* eslint-disable require-jsdoc */
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
// import { getEnvVar } from "../helpers/getEnvVariable";
const hobby_1 = require("../hobby");
const anthropic = new sdk_1.default({
    apiKey: "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",
});
async function test() {
    console.log("awaiting...........");
    await claude();
}
async function claude() {
    const phrase = "let's play League of Legends this Monday";
    // Adjust the prompt to be more directive about the output format
    const prompt = `Given the phrase "${phrase}", analyze its content and provide the top 3 most probable tags 
  from a predefined tag list, and also suggest the top three possible tags not included in the tag list. 
  Format the response as two separate arrays: the first array for tags from the tag l
  ist with their probabilities, and the second array for possible tags not on the list. 
  Each entry in the first array should be an object with 'tag' and 'probability' keys. 
  Example format: [[{tag: 'Tag1', probability: 'High'}, ...], ['TagA', 'TagB', 'TagC']]`;
    const message = await anthropic.messages.create({
        max_tokens: 1024,
        system: `This is the taglist ${hobby_1.hobbyTags}`,
        messages: [{ role: "user", content: prompt }],
        model: "claude-3-opus-20240229",
    });
    // Assuming the response is directly in the desired format
    const content = message.content;
    console.log(content);
}
//# sourceMappingURL=Claude.js.map