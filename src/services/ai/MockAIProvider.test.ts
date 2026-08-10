import test from 'node:test';
import assert from 'node:assert/strict';
import MockAIProvider from './MockAIProvider';

test('processRevision adds a revision summary section and increments version', async () => {
    const provider = new MockAIProvider();
    const spec = {
        name: 'North Studio',
        description: 'Premium handmade products',
        version: 1,
        pages: [{ slug: 'home', title: 'Home', sections: [] }],
        theme: { primaryColor: '#111111' },
        navigation: {},
        footer: {},
    };

    const updated = await provider.processRevision(spec as any, 'Make the homepage feel more premium');

    assert.equal(updated.version, 2);
    const homePage = (updated.pages as Array<{ slug: string; sections: Array<{ component: string }> }>).find((page) => page.slug === 'home');
    assert.ok(homePage);
    assert.equal(homePage?.sections[0]?.component, 'AboutStory');
});
