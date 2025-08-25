import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Navigate to the learning modules page
            await page.goto("http://127.0.0.1:8080/learning-3d")

            # Wait for the page to be fully loaded
            await page.wait_for_load_state('networkidle')

            # Wait for the page to load and find the "Breath of Source Mastery" card
            card_title = page.get_by_role("heading", name="Breath of Source Mastery")
            await expect(card_title).to_be_visible(timeout=30000)

            # Click the card to load the module
            await card_title.click()

            # Wait for the 3D scene to load. We can wait for the new UI to be visible.
            # A good indicator is the "Lesson 0" badge.
            lesson_badge = page.get_by_text("Lesson 0")
            await expect(lesson_badge).to_be_visible(timeout=30000)

            # Take a screenshot
            await page.screenshot(path="jules-scratch/verification/breath_of_source_module.png")
            print("Screenshot taken successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
