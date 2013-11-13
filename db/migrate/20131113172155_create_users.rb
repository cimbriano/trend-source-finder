class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :user_name
      t.string :location
      t.string :url
      t.string :description
      t.integer :followers
      t.integer :friends

      t.timestamps
    end
  end
end
