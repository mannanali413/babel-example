module.exports = function(babel){
	var t = babel.types;

	function moriMethod(name){
		var expr = t.memberExpression(
			t.identifier('mori'),
			t.identifier(name)
			);
		expr.isClean = true;
		return expr;
	}

	return {
		visitor: {
			ArrayExpression: function(path){
				path.replaceWith(
					t.callExpression(
						moriMethod('vector'),
						path.node.elements
						)
					);
			},
			ObjectExpression: function(path){
				var props = [];
				path.node.properties.forEach(function(prop){
					props.push(
						t.stringLiteral(prop.key.name),
						prop.value
						);
				});
				path.replaceWith(
					t.callExpression(
						moriMethod('hashMap'),
						props
						)
					);
			},
			AssignmentExpression: function(path){
				var lhs = path.node.left,
					rhs = path.node.right;

				if(t.isMemberExpression(lhs)){
					if(t.isIdentifier(lhs.property)){
						lhs.property = t.stringLiteral(lhs.property.name)
					}

					path.replaceWith(
						t.callExpression(
							moriMethod('assoc'),
							[lhs.object, lhs.property, rhs]
							)
						)
				}
			},
			MemberExpression: function(path){
				if(path.node.isClean) return;
				if(t.isAssignmentExpression(path.parent)) return;

				if(t.isIdentifier(path.node.property)){
					path.node.property = t.stringLiteral(path.node.property.name);
				}

				path.replaceWith(
					t.callExpression(
						moriMethod('get'),
						[path.node.object, path.node.property]
						)
					)
			},
			  BinaryExpression: function(path){
				if(path.node.operator !== "|") return;

				function doublePiping(innerPath){
                  console.log(innerPath);
					var outerFunc = innerPath.node? innerPath.node.right : innerPath.right,
						outerFuncArgs = innerPath.node? innerPath.node.left: innerPath.left;
					if(t.isBinaryExpression(outerFuncArgs)){
						return t.callExpression(outerFunc, [doublePiping(outerFuncArgs)]);
					}
					else{
						return t.callExpression(outerFunc, [outerFuncArgs]);
					}
				}

				path.replaceWith(
						doublePiping(path)
					)
			}
		}
	}
}