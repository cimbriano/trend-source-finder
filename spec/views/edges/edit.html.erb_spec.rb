require 'spec_helper'

describe "edges/edit" do
  before(:each) do
    @edge = assign(:edge, stub_model(Edge))
  end

  it "renders the edit edge form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", edge_path(@edge), "post" do
    end
  end
end
