var _ = require("underscore")._;
var util = require("util");

var Query = function(args, object) {
  this.source = object.delimitedFullName;
  this.columns = args.columns || "*";
  this.only = args.only || false;
  this.order = args.order || (object.hasOwnProperty("pk") ? util.format('"%s"', object.pk) : "1");
  this.orderBody = args.orderBody || false;
  this.offset = args.offset;
  this.limit = args.limit;
  this.stream = args.stream;
  this.single = args.single || false;
  if (args.paginate) {
    this.paginate = _.extend({
      count: "count",
      limit: this.limit,
      offset: this.offset
    }, (_.isString(args.paginate) ? {count: args.paginate} : args.paginate));
    this.paginate.sql = util.format("(SELECT COUNT(*) FROM %s %s) AS %s", object.delimitedFullName, "%s", this.paginate.count);
  }
};

Query.prototype.format = function (where) {
  var from = this.only ? " FROM ONLY " : " FROM ";

  return "SELECT " + this.selectList(where) + from + this.source + where + this.queryOptions();
};

Query.prototype.selectList = function (where) {
  if (_.isArray(this.columns)) {
    this.columns = this.columns.join(',');
  }
  if (this.paginate) {
    return util.format("%s, %s", this.columns, util.format(this.paginate.sql, where));
  }

  return this.columns;
};

Query.prototype.queryOptions = function () {
  if (_.isArray(this.order)) {
    var orderBody = this.orderBody;

    this.order = _.reduce(this.order, function (acc, val) {
      val.direction = val.direction || "asc";

      if (orderBody) {
        val.field = util.format("body->>'%s'", val.field);
      }

      if (val.type) {
        acc.push(util.format("(%s)::%s %s", val.field, val.type, val.direction));
      } else {
        acc.push(util.format("%s %s", val.field, val.direction));
      }

      return acc;
    }, []).join(",");
  }

  var sql = "";

  if (this.order) { sql = " order by " + this.order; }
  if (this.offset) { sql += " offset " + this.offset; }
  if (this.limit || this.single) { sql += " limit " + (this.limit || "1"); }

  return sql;
};

module.exports = Query;
