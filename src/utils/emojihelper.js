import emoji from "../Assets/category_emoji.json";

export const emojiMap = new Map(emoji);

export const addCategoryemoji = (orders) => {
  console.log("Adding emojis to categories in orders");
  return orders.map((order) => ({
    ...order,
    items: order.items.map((item) => {
      return { ...item, emojiicon: emojiMap.get(item.categories) || "📦" };
    }), // Default emoji if not found
  }));
};
