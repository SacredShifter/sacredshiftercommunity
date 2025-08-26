import asyncio
from playwright.async_api import async_playwright, expect

async def take_screenshot(page, url, path):
    print(f"Navigating to {url}")
    await page.goto(url)
    print(f"Waiting for canvas on {url}")
    await expect(page.locator("canvas")).to_be_visible(timeout=10000)
    print(f"Canvas found on {url}. Waiting for render.")
    await page.wait_for_timeout(2000)
    await page.screenshot(path=path)
    print(f"Screenshot saved to {path}")

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        base_url = "http://localhost:8082/learn/hermetic"

        scenes = [
            "polarity",
            "rhythm",
            "cause-effect",
            "gender"
        ]

        for scene in scenes:
            url = f"{base_url}/{scene}"
            path = f"jules-scratch/verification/{scene}_scene.png"
            await take_screenshot(page, url, path)

        await browser.close()

asyncio.run(main())
