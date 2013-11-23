# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :tweet do
    text 'Hello World, this is a tweet'
    twitter_id '1234567890'
    created_at '2013-11-20 16:09:25 -0500'
  end
end
