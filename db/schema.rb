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

ActiveRecord::Schema.define(version: 20200506054322) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "event_groups", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "event_tags", force: :cascade do |t|
    t.bigint "event_id"
    t.bigint "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_event_tags_on_event_id"
    t.index ["tag_id"], name: "index_event_tags_on_tag_id"
  end

  create_table "event_types", id: :serial, force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["updated_at"], name: "index_event_types_on_updated_at"
  end

  create_table "events", id: :serial, force: :cascade do |t|
    t.text "description"
    t.datetime "time"
    t.integer "capacity"
    t.integer "duration"
    t.integer "organization_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "title"
    t.integer "event_type_id"
    t.string "location"
    t.datetime "follow_up_email_sent_at"
    t.integer "office_id", default: 1, null: false
    t.integer "event_group_id"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.datetime "deleted_at"
    t.index ["event_type_id"], name: "index_events_on_event_type_id"
    t.index ["organization_id"], name: "index_events_on_organization_id"
    t.index ["updated_at"], name: "index_events_on_updated_at"
  end

  create_table "individual_event_tags", force: :cascade do |t|
    t.bigint "individual_event_id"
    t.bigint "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["individual_event_id"], name: "index_individual_event_tags_on_individual_event_id"
    t.index ["tag_id"], name: "index_individual_event_tags_on_tag_id"
  end

  create_table "individual_events", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "organization_id", null: false
    t.integer "event_type_id", null: false
    t.integer "office_id", null: false
    t.integer "duration", null: false
    t.text "description"
    t.date "date", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "status", limit: 2, default: 0, null: false
    t.datetime "deleted_at"
    t.index ["event_type_id"], name: "index_individual_events_on_event_type_id"
    t.index ["office_id"], name: "index_individual_events_on_office_id"
    t.index ["organization_id"], name: "index_individual_events_on_organization_id"
    t.index ["user_id"], name: "index_individual_events_on_user_id"
  end

  create_table "offices", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.string "identifier", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "timezone"
    t.index ["updated_at"], name: "index_offices_on_updated_at"
  end

  create_table "organizations", id: :serial, force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "location"
    t.string "website"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["updated_at"], name: "index_organizations_on_updated_at"
  end

  create_table "roles", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sessions", id: :serial, force: :cascade do |t|
    t.string "session_id", null: false
    t.text "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["session_id"], name: "index_sessions_on_session_id", unique: true
    t.index ["updated_at"], name: "index_sessions_on_updated_at"
  end

  create_table "signups", id: :serial, force: :cascade do |t|
    t.string "management_level"
    t.string "team"
    t.boolean "fulfilled"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "event_id"
    t.integer "user_id"
    t.integer "hours_worked"
    t.index ["event_id"], name: "index_signups_on_event_id"
    t.index ["user_id"], name: "index_signups_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_preferences", force: :cascade do |t|
    t.boolean "confirmed_profile_settings", default: false, null: false
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_preferences_on_user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "photo"
    t.string "locale"
    t.string "first_name"
    t.string "last_name"
    t.integer "role_id"
    t.string "timezone", default: "UTC", null: false
    t.integer "office_id"
    t.string "encrypted_google_token"
    t.string "encrypted_google_token_iv"
    t.datetime "deleted_at"
    t.string "group"
    t.jsonb "metadata"
    t.index ["deleted_at"], name: "index_users_on_deleted_at"
    t.index ["email", "deleted_at"], name: "index_users_on_email_and_deleted_at"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role_id"], name: "index_users_on_role_id"
    t.index ["updated_at"], name: "index_users_on_updated_at"
  end

  add_foreign_key "event_tags", "events"
  add_foreign_key "event_tags", "tags"
  add_foreign_key "individual_event_tags", "individual_events"
  add_foreign_key "individual_event_tags", "tags"
  add_foreign_key "user_preferences", "users"
end
