const CACHE_NAME = 'questionnaireCodes';

export default function makeQuestionnaireCodesModel(cache) {

    const model = {
        add,
        has
    };

    return Object.freeze(model);

    function add(code) {
        const codes = cache.get(CACHE_NAME) || [];
        codes.push(code);
        cache.set(CACHE_NAME, codes);
    }

    function has(code) {
        const codes = cache.get(CACHE_NAME);
        return codes.indexOf(code) >= 0;
    }

}