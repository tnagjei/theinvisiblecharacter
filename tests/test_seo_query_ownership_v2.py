"""input: Local ignored GSC exports and the V2 ownership analysis module.
output: Regression checks for metric layers, URL roles, coverage matching, and report consistency.
pos: SEO data-pipeline regression suite. Update this header when V2 contracts change.
"""

import importlib.util
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("seo_query_ownership", ROOT / "scripts" / "seo-query-ownership.py")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class QueryOwnershipV2Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.result = MODULE.build_v2(write_outputs=False)

    def test_property_metric_layers_are_not_merged(self):
        self.assertEqual((59, 6105), (self.result["property_total"]["clicks"], self.result["property_total"]["impressions"]))
        self.assertEqual((18, 2500), (self.result["property_queries"]["clicks"], self.result["property_queries"]["impressions"]))

    def test_homepage_exact_total_excludes_fragment_variants(self):
        homepage = next(row for row in self.result["page_rows"] if row["raw_url"] == "https://theinvisiblecharacter.live/")
        self.assertEqual((35, 2715), (homepage["page_total_clicks"], homepage["page_total_impressions"]))

    def test_legacy_coverage_does_not_propagate_to_clean_url(self):
        discovered = [row for row in self.result["page_rows"] if row["current_index_status"] == "discovered_not_indexed_snapshot"]
        self.assertEqual([], discovered)

    def test_old_tiktok_rule_matches_acceptance_baseline(self):
        self.assertEqual((13, 321), (self.result["old_tiktok_total"]["clicks"], self.result["old_tiktok_total"]["impressions"]))

    def test_supporting_pages_exclude_proposed_owner(self):
        for row in self.result["ownership_rows"]:
            self.assertNotIn(row["proposed_primary_owner"], row["supporting_pages"].split(";") if row["supporting_pages"] else [])

    def test_report_actions_match_csv_actions(self):
        self.assertEqual(self.result["csv_actions"], self.result["report_actions"])


if __name__ == "__main__":
    unittest.main()
