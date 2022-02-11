const mongoose = require("mongoose");

const RecentSearchResultSchema = mongoose.Schema(
  {
    type: String,
    item: {},
    userId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const RecentSearchResult = mongoose.model(
  "RecentSearchResult",
  RecentSearchResultSchema,
  "recent_search_results"
);
module.exports = RecentSearchResult;
