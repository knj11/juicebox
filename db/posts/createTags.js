const client = require("../client.js")

async function createTags(tagList) {
  if (tagList.length === 0) {
    return;
  }

  // need something like: $1), ($2), ($3 
  const insertValues = tagList.map(
    (_, index) => `$${index + 1}`).join('), (');
  // then we can use: (${ insertValues }) in our string template

  // need something like $1, $2, $3
  const selectValues = tagList.map(
    (_, index) => `$${index + 1}`).join(', ');
  // then we can use (${ selectValues }) in our string template

  try {
    // insert the tags, doing nothing on conflict

    await client.query(/*sql*/`
      INSERT INTO tags(name)
      VALUES (${insertValues})
      ON CONFLICT (name) DO NOTHING;
    `, tagList)
    // returning nothing, we'll query after
    console.log("attempting to select tags")
    const { rows } = await client.query(/*sql*/`
      SELECT * FROM tags
      WHERE name
      IN (${selectValues});
    `, tagList)
    // select all tags where the name is in our taglist
    // return the rows from the query
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = createTags;