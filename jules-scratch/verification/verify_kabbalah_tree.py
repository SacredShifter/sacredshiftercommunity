from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for all console events and print them
        page.on("console", lambda msg: print(f"Browser console: {msg}"))

        try:
            page.goto("http://127.0.0.1:8080/grove", timeout=60000)

            # Wait for the canvas element to be visible
            canvas = page.locator('canvas')
            expect(canvas).to_be_visible(timeout=10000)

            # Give the scene some time to render completely
            page.wait_for_timeout(5000)

            page.screenshot(path="jules-scratch/verification/kabbalah-tree.png")
            print("Screenshot taken successfully.")
        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
