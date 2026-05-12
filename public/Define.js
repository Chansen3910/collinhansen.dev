export async function getDefinition(itemId) {
    const mod = await import(`/public/items/${ itemId }.json`, {
        assert: { type: 'json' }
    });

    return(await JSON.parse(await JSON.stringify(await mod.default)));
}
