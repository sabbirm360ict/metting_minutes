"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const elasticSearch_1 = __importDefault(require("../../../app/elasticSearch"));
class AdminUtils {
    createPlacesIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            const indexName = 'places';
            const exists = yield elasticSearch_1.default.indices.exists({ index: indexName });
            if (!exists) {
                const phoneticFilter = {
                    type: 'phonetic',
                    encoder: 'double_metaphone',
                    replace: false,
                    languageset: ['english'],
                    name_type: 'generic',
                    rule_type: 'approx',
                };
                const indexParams = {
                    index: indexName,
                    settings: {
                        index: {
                            refresh_interval: '30s',
                            max_ngram_diff: 12, // Allow larger N-gram difference
                        },
                        analysis: {
                            tokenizer: {
                                edge_ngram_tokenizer: {
                                    type: 'edge_ngram',
                                    min_gram: 2,
                                    max_gram: 12,
                                    token_chars: ['letter', 'digit'],
                                },
                                ngram_tokenizer: {
                                    type: 'ngram',
                                    min_gram: 3,
                                    max_gram: 12, // Reduced from 15 to optimize performance
                                    token_chars: ['letter', 'digit'],
                                },
                            },
                            filter: {
                                my_phonetic: phoneticFilter,
                            },
                            analyzer: {
                                autocomplete_analyzer: {
                                    type: 'custom',
                                    tokenizer: 'edge_ngram_tokenizer',
                                    filter: ['lowercase'],
                                },
                                autocomplete_search_analyzer: {
                                    type: 'custom',
                                    tokenizer: 'standard',
                                    filter: ['lowercase'],
                                },
                                phonetic_analyzer: {
                                    type: 'custom',
                                    tokenizer: 'standard',
                                    filter: ['lowercase', 'my_phonetic'],
                                },
                                concat_analyzer: {
                                    type: 'custom',
                                    tokenizer: 'ngram_tokenizer',
                                    filter: ['lowercase'],
                                },
                                concat_search_analyzer: {
                                    type: 'custom',
                                    tokenizer: 'standard',
                                    filter: ['lowercase'],
                                },
                            },
                        },
                    },
                    mappings: {
                        properties: {
                            label: {
                                type: 'text',
                                analyzer: 'autocomplete_analyzer',
                                search_analyzer: 'autocomplete_search_analyzer',
                                fields: {
                                    phonetic: { type: 'text', analyzer: 'phonetic_analyzer' },
                                    suggest: { type: 'completion' },
                                    concat: {
                                        type: 'text',
                                        analyzer: 'concat_analyzer',
                                        search_analyzer: 'concat_search_analyzer',
                                    },
                                },
                            },
                            name: {
                                type: 'text',
                                analyzer: 'autocomplete_analyzer',
                                search_analyzer: 'autocomplete_search_analyzer',
                            },
                            city_name: {
                                type: 'text',
                                analyzer: 'autocomplete_analyzer',
                                search_analyzer: 'autocomplete_search_analyzer',
                            },
                            country_name: {
                                type: 'text',
                                analyzer: 'autocomplete_analyzer',
                                search_analyzer: 'autocomplete_search_analyzer',
                            },
                            star_category: { type: 'integer' },
                            type: { type: 'keyword' },
                            city_code: { type: 'integer' },
                            country_code: { type: 'keyword' },
                            code: { type: 'integer' },
                            id: { type: 'integer' },
                        },
                    },
                };
                yield elasticSearch_1.default.indices.create(indexParams);
                console.log(`Index '${indexName}' created successfully.`);
            }
            else {
                console.log(`Index '${indexName}' already exists.`);
            }
        });
    }
}
exports.default = AdminUtils;
