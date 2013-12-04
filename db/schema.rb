# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131204143757) do

  create_table "edges", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "child_id"
    t.integer  "parent_id"
  end

  add_index "edges", ["child_id"], name: "index_edges_on_child_id"
  add_index "edges", ["parent_id"], name: "index_edges_on_parent_id"

  create_table "tweets", force: true do |t|
    t.string   "text"
    t.string   "twitter_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.string   "retweeted_id"
    t.string   "in_reply_to_status_str"
  end

  add_index "tweets", ["in_reply_to_status_str"], name: "index_tweets_on_in_reply_to_status_str"
  add_index "tweets", ["user_id"], name: "index_tweets_on_user_id"

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "user_name"
    t.string   "location"
    t.string   "url"
    t.string   "description"
    t.integer  "followers"
    t.integer  "friends"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
