"""Quick smoke test — run: python test_convert.py"""
from services.markitdown_service import convert_to_markdown
from services.token_counter import count_tokens

sample_text = b"""# Meeting Notes - Q2 Planning

## Attendees
- Alice (Engineering)
- Bob (Product)
- Carol (Design)

## Action Items
1. Alice will finalize the API spec by Friday
2. Bob to write user stories for the new dashboard
3. Carol to share wireframes by end of week

## Key Decisions
The team agreed to use React for the new frontend.
Budget approved: $50,000 for infrastructure upgrades.
"""

md = convert_to_markdown(sample_text, "meeting_notes.txt")
before = count_tokens(sample_text.decode())
after = count_tokens(md)
saved = before - after
pct = round((saved / before) * 100) if before > 0 else 0

print(f"tokens_before:  {before}")
print(f"tokens_after:   {after}")
print(f"tokens_saved:   {saved}")
print(f"savings_pct:    {pct}%")
print(f"\nMarkdown output:\n{md[:300]}")
