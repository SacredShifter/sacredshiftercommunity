import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        await page.goto("http://localhost:8080")

        # It's likely we'll land on a login page.
        # For now, let's just see what the page looks like.
        # We will need to handle authentication to get to the messages page.
        await page.wait_for_load_state("networkidle")

        await page.screenshot(path="jules-scratch/verification/01_landing_page.png")

        # Let's try to find a login form.
        # This is a guess, we might need to adjust selectors.
        email_input = page.get_by_placeholder("Enter your email")
        password_input = page.get_by_placeholder("Enter your password")

        if await email_input.is_visible() and await password_input.is_visible():
            print("Login form found. Need credentials to proceed.")
            # We can't proceed without credentials.
            # For now, this script just confirms the app loads.
        else:
            print("Login form not found. The app might be accessible without login, or the selectors are wrong.")
            # If there's no login, maybe we can navigate to the messages page directly.
            # This is a guess.
            await page.goto("http://localhost:8080/messages")
            await page.wait_for_load_state("networkidle")
            await page.screenshot(path="jules-scratch/verification/02_messages_page.png")


        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
